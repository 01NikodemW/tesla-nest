import { IsInt, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({
    description: 'User ID who is making the reservation',
    example: 1,
  })
  @IsInt()
  userId: number;

  @ApiProperty({ description: 'Vehicle ID being reserved', example: 2 })
  @IsInt()
  vehicleId: number;

  @ApiProperty({ description: 'Rental start date', example: '2025-02-10' })
  @IsDateString()
  rentalDate: string;

  @ApiProperty({ description: 'Return date', example: '2025-02-15' })
  @IsDateString()
  returnDate: string;
}
