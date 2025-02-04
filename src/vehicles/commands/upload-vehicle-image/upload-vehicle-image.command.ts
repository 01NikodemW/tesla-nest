import { ICommand } from '@nestjs/cqrs';

export class UploadVehicleImageCommand implements ICommand {
  constructor(
    public readonly vehicleId: number,
    public readonly file: Express.Multer.File,
  ) {}
}
