import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateReservationCommand } from './update-reservation.command';
import { ReservationsService } from 'src/reservations/reservations.service';
import { Reservation } from 'src/reservations/entities/reservation.entity';

@CommandHandler(UpdateReservationCommand)
export class UpdateReservationHandler
  implements ICommandHandler<UpdateReservationCommand>
{
  constructor(private readonly reservationsService: ReservationsService) {}

  async execute(command: UpdateReservationCommand): Promise<Reservation> {
    return this.reservationsService.update(command.id, command.dto);
  }
}
