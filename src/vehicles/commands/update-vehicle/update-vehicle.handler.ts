import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateVehicleCommand } from './update-vehicle.command';
import { VehiclesService } from '../../vehicles.service';
import { Vehicle } from '../../entities/vehicle.entity';

@CommandHandler(UpdateVehicleCommand)
export class UpdateVehicleHandler
  implements ICommandHandler<UpdateVehicleCommand>
{
  constructor(private readonly vehiclesService: VehiclesService) {}

  async execute(command: UpdateVehicleCommand): Promise<Vehicle> {
    return this.vehiclesService.update(command.id, command.dto);
  }
}
