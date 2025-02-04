import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateVehicleCommand } from './create-vehicle.command';
import { VehiclesService } from '../../vehicles.service';
import { Vehicle } from '../../entities/vehicle.entity';

@CommandHandler(CreateVehicleCommand)
export class CreateVehicleHandler
  implements ICommandHandler<CreateVehicleCommand>
{
  constructor(private readonly vehiclesService: VehiclesService) {}

  async execute(command: CreateVehicleCommand): Promise<Vehicle> {
    return this.vehiclesService.create(command.dto);
  }
}
