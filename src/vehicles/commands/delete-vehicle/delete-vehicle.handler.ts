import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteVehicleCommand } from './delete-vehicle.command';
import { VehiclesService } from '../../vehicles.service';

@CommandHandler(DeleteVehicleCommand)
export class DeleteVehicleHandler
  implements ICommandHandler<DeleteVehicleCommand>
{
  constructor(private readonly vehiclesService: VehiclesService) {}

  async execute(command: DeleteVehicleCommand): Promise<void> {
    return this.vehiclesService.delete(command.id);
  }
}
