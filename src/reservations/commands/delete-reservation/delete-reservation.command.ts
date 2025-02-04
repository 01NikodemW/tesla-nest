import { ICommand } from '@nestjs/cqrs';

export class DeleteReservationCommand implements ICommand {
  constructor(public readonly id: number) {}
}
