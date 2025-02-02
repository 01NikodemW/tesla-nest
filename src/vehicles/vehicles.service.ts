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
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(VehicleImage)
    private readonly vehicleImageRepository: Repository<VehicleImage>,
    private readonly azureStorageService: AzureStorageService,
    private readonly paginationService: PaginationService,
    private readonly loggerService: LoggerService,
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    this.loggerService.log(
      `Creating vehicle: ${JSON.stringify(createVehicleDto)}`,
    );

    const vehicle = this.vehicleRepository.create(createVehicleDto);
    const savedVehicle = await this.vehicleRepository.save(vehicle);

    this.loggerService.log(`Vehicle created with ID: ${savedVehicle.id}`);
    return savedVehicle;
  }

  async findAll(paginationDto: PaginationDto) {
    this.loggerService.log(
      `Fetching all vehicles with pagination: ${JSON.stringify(paginationDto)}`,
    );

    const queryBuilder = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.images', 'images');

    const result = await this.paginationService.paginate(
      queryBuilder,
      paginationDto,
      'vehicle',
    );

    this.loggerService.log(`Fetched ${result.data.length} vehicles`);
    return result;
  }

  async findOne(id: number): Promise<Vehicle> {
    this.loggerService.log(`Fetching vehicle with ID: ${id}`);

    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!vehicle) {
      this.loggerService.warn(`Vehicle with ID ${id} not found`);
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    this.loggerService.log(`Vehicle found: ${JSON.stringify(vehicle)}`);
    return vehicle;
  }

  async update(
    id: number,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    this.loggerService.log(
      `Updating vehicle ID ${id} with data: ${JSON.stringify(updateVehicleDto)}`,
    );

    const vehicle = await this.findOne(id);
    Object.assign(vehicle, updateVehicleDto);
    const updatedVehicle = await this.vehicleRepository.save(vehicle);

    this.loggerService.log(`Vehicle ID ${id} updated successfully`);
    return updatedVehicle;
  }

  async delete(id: number): Promise<void> {
    this.loggerService.warn(`Deleting vehicle with ID: ${id}`);

    const vehicle = await this.findOne(id);
    await this.vehicleRepository.remove(vehicle);

    this.loggerService.warn(`Vehicle with ID ${id} deleted`);
  }

  async uploadImage(
    vehicleId: number,
    file: Express.Multer.File,
  ): Promise<VehicleImage> {
    this.loggerService.log(`Uploading image for vehicle ID: ${vehicleId}`);

    const vehicle = await this.findOne(vehicleId);
    if (!vehicle) {
      this.loggerService.warn(
        `Vehicle ID ${vehicleId} not found for image upload`,
      );
      throw new NotFoundException('Vehicle not found');
    }

    const imageUrl = await this.azureStorageService.uploadFile(file);
    const vehicleImage = this.vehicleImageRepository.create({
      vehicle,
      imageUrl,
    });

    const savedImage = await this.vehicleImageRepository.save(vehicleImage);
    this.loggerService.log(
      `Image uploaded for vehicle ID ${vehicleId}: ${imageUrl}`,
    );

    return savedImage;
  }
}
