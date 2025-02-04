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
import { CreateVehicleHandler } from './commands/create-vehicle/create-vehicle.handler';
import { DeleteVehicleHandler } from './commands/delete-vehicle/delete-vehicle.handler';
import { UpdateVehicleHandler } from './commands/update-vehicle/update-vehicle.handler';
import { GetVehicleByIdHandler } from './queries/get-vehicle-by-id/get-vehicle-by-id.handler';
import { GetVehiclesHandler } from './queries/get-vehicles/get-vehicles.handler';
import { UploadVehicleImageHandler } from './commands/upload-vehicle-image/upload-vehicle-image.handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle, VehicleImage]),
    AzureStorageModule,
    PaginationModule,
    LoggerModule,
    CqrsModule,
  ],
  controllers: [VehiclesController],
  providers: [
    VehiclesService,
    CreateVehicleHandler,
    UpdateVehicleHandler,
    DeleteVehicleHandler,
    UploadVehicleImageHandler,
    GetVehiclesHandler,
    GetVehicleByIdHandler,
  ],
})
export class VehiclesModule {}
