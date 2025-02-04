import { IQuery } from '@nestjs/cqrs';

export class GetVehicleByIdQuery implements IQuery {
  constructor(public readonly id: number) {}
}
