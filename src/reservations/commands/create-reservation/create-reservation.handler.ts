import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateReservationCommand } from './create-reservation.command';
import { ReservationsService } from 'src/reservations/reservations.service';
import { Reservation } from 'src/reservations/entities/reservation.entity';

@CommandHandler(CreateReservationCommand)
export class CreateReservationHandler
  implements ICommandHandler<CreateReservationCommand>
{
  constructor(private readonly reservationsService: ReservationsService) {}

  async execute(command: CreateReservationCommand): Promise<Reservation> {
    return this.reservationsService.create(command.dto);
  }
}
