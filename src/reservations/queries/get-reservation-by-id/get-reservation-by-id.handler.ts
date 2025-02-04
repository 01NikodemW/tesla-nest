import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReservationByIdQuery } from './get-reservation-by-id.query';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { ReservationsService } from 'src/reservations/reservations.service';

@QueryHandler(GetReservationByIdQuery)
export class GetReservationsByIdHandler
  implements IQueryHandler<GetReservationByIdQuery>
{
  constructor(private readonly reservationsService: ReservationsService) {}

  async execute(query: GetReservationByIdQuery): Promise<Reservation> {
    return this.reservationsService.findOne(query.id);
  }
}
