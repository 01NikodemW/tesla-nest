import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteReservationCommand } from './delete-reservation.command';
import { ReservationsService } from 'src/reservations/reservations.service';

@CommandHandler(DeleteReservationCommand)
export class DeleteReservationHandler
  implements ICommandHandler<DeleteReservationCommand>
{
  constructor(private readonly reservationsService: ReservationsService) {}

  async execute(command: DeleteReservationCommand) {
    return this.reservationsService.delete(command.id);
  }
}
