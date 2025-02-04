import { ICommand } from '@nestjs/cqrs';
import { UpdateReservationDto } from 'src/reservations/dto/update-reservation.dto';

export class UpdateReservationCommand implements ICommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateReservationDto,
  ) {}
}
