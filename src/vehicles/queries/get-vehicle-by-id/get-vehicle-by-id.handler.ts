import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetVehicleByIdQuery } from './get-vehicle-by-id.query';
import { VehiclesService } from '../../vehicles.service';
import { Vehicle } from '../../entities/vehicle.entity';

@QueryHandler(GetVehicleByIdQuery)
export class GetVehicleByIdHandler
  implements IQueryHandler<GetVehicleByIdQuery>
{
  constructor(private readonly vehiclesService: VehiclesService) {}

  async execute(query: GetVehicleByIdQuery): Promise<Vehicle> {
    return this.vehiclesService.findOne(query.id);
  }
}
