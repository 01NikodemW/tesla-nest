import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleImage } from './entities/vehicle-image.entity';
import { AzureStorageModule } from '../azure-storage/azure-storage.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { LoggerModule } from 'src/logger/logger.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle, VehicleImage]),
    AzureStorageModule,
    PaginationModule,
    LoggerModule,
    AuthModule
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
