import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetVehiclesQuery } from './get-vehicles.query';
import { VehiclesService } from '../../vehicles.service';
import { Vehicle } from '../../entities/vehicle.entity';
import { PaginatedResponse } from 'src/common/pagination/pagination-response.dto';

@QueryHandler(GetVehiclesQuery)
export class GetVehiclesHandler implements IQueryHandler<GetVehiclesQuery> {
  constructor(private readonly vehiclesService: VehiclesService) {}

  async execute(query: GetVehiclesQuery): Promise<PaginatedResponse<Vehicle>> {
    return this.vehiclesService.findAll(query.paginationDto);
  }
}
