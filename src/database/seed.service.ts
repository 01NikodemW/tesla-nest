import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../vehicles/entities/vehicle.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async seedVehicles(): Promise<void> {
    const count = await this.vehicleRepository.count();

    if (count > 0) {
      this.logger.log(
        'Seeding skipped. Vehicles already exist in the database.',
      );
      return;
    }

    const vehicles = [
      { make: 'Toyota', model: 'Corolla', year: 2022, rentalPricePerDay: 50 },
      { make: 'Honda', model: 'Civic', year: 2021, rentalPricePerDay: 45 },
      { make: 'Ford', model: 'Focus', year: 2023, rentalPricePerDay: 55 },
      { make: 'Tesla', model: 'Model 3', year: 2022, rentalPricePerDay: 80 },
      { make: 'Tesla', model: 'Model S', year: 2022, rentalPricePerDay: 80 },
    ];

    this.logger.log('Seeding vehicles...');
    await this.vehicleRepository.save(vehicles);
    this.logger.log('Seeding completed.');
  }
}
