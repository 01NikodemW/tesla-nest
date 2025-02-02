import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleImage } from './entities/vehicle-image.entity';
import { CreateVehicleImageDto } from './dto/create-vehicle-image.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(VehicleImage)
    private readonly vehicleImageRepository: Repository<VehicleImage>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const vehicle = this.vehicleRepository.create(createVehicleDto);
    return this.vehicleRepository.save(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepository.find({ relations: ['images'] });
  }

  async findOne(id: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!vehicle)
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    return vehicle;
  }

  async update(
    id: number,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    const vehicle = await this.findOne(id);
    Object.assign(vehicle, updateVehicleDto);
    return this.vehicleRepository.save(vehicle);
  }

  async delete(id: number): Promise<void> {
    const vehicle = await this.findOne(id);
    await this.vehicleRepository.remove(vehicle);
  }

  async addImage(
    createVehicleImageDto: CreateVehicleImageDto,
  ): Promise<VehicleImage> {
    const vehicle = await this.findOne(createVehicleImageDto.vehicleId);
    const vehicleImage = this.vehicleImageRepository.create({
      vehicle,
      imageUrl: createVehicleImageDto.imageUrl,
    });

    return this.vehicleImageRepository.save(vehicleImage);
  }

  async removeImage(imageId: number): Promise<void> {
    const image = await this.vehicleImageRepository.findOne({
      where: { id: imageId },
    });
    if (!image) throw new NotFoundException('Image not found');
    await this.vehicleImageRepository.remove(image);
  }
}
