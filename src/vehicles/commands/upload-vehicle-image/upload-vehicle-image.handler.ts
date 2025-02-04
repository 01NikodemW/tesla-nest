import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VehiclesService } from '../../vehicles.service';
import { VehicleImage } from 'src/vehicles/entities/vehicle-image.entity';
import { UploadVehicleImageCommand } from './upload-vehicle-image.command';

@CommandHandler(UploadVehicleImageCommand)
export class UploadVehicleImageHandler
  implements ICommandHandler<UploadVehicleImageCommand>
{
  constructor(private readonly vehiclesService: VehiclesService) {}

  async execute(command: UploadVehicleImageCommand): Promise<VehicleImage> {
    return this.vehiclesService.uploadImage(command.vehicleId, command.file);
  }
}
