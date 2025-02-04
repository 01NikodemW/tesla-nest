import { ICommand } from '@nestjs/cqrs';
import { UpdateVehicleDto } from '../../dto/update-vehicle.dto';

export class UpdateVehicleCommand implements ICommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateVehicleDto,
  ) {}
}
