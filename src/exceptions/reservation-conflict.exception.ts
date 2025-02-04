import { BadRequestException } from '@nestjs/common';

export class ReservationConflictException extends BadRequestException {
  constructor(vehicleId: number, rentalDate: string, returnDate: string) {
    super(
      `This vehicle (ID: ${vehicleId}) is already reserved from ${rentalDate} to ${returnDate}`,
    );
  }
}
