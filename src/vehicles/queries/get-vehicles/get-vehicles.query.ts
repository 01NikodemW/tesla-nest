import { IQuery } from '@nestjs/cqrs';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

export class GetVehiclesQuery implements IQuery {
  constructor(public readonly paginationDto: PaginationDto) {}
}
