import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleImage } from './entities/vehicle-image.entity';
import { AzureStorageService } from '../azure-storage/azure-storage.service';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(VehicleImage)
    private readonly vehicleImageRepository: Repository<VehicleImage>,
    private readonly azureStorageService: AzureStorageService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const vehicle = this.vehicleRepository.create(createVehicleDto);
    return this.vehicleRepository.save(vehicle);
  }

  async findAll(paginationDto: PaginationDto) {
    const queryBuilder = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.images', 'images');

    return this.paginationService.paginate(
      queryBuilder,
      paginationDto,
      'vehicle',
    );
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

  async uploadImage(
    vehicleId: number,
    file: Express.Multer.File,
  ): Promise<VehicleImage> {
    const vehicle = await this.findOne(vehicleId);
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    const imageUrl = await this.azureStorageService.uploadFile(file);
    const vehicleImage = this.vehicleImageRepository.create({
      vehicle,
      imageUrl,
    });

    return this.vehicleImageRepository.save(vehicleImage);
  }
}
