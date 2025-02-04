import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReservationsQuery } from './get-reservations.query';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { PaginatedResponse } from 'src/common/pagination/pagination-response.dto';
import { ReservationsService } from 'src/reservations/reservations.service';

@QueryHandler(GetReservationsQuery)
export class GetReservationsHandler
  implements IQueryHandler<GetReservationsQuery>
{
  constructor(private readonly reservationsService: ReservationsService) {}

  async execute(
    query: GetReservationsQuery,
  ): Promise<PaginatedResponse<Reservation>> {
    return this.reservationsService.findAll(query.paginationDto);
  }
}
