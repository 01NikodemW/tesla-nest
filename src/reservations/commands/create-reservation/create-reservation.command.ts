import { ICommand } from "@nestjs/cqrs";
import { CreateReservationDto } from "src/reservations/dto/create-reservation.dto";

export class CreateReservationCommand implements ICommand {
  constructor(public readonly dto: CreateReservationDto) {}
}