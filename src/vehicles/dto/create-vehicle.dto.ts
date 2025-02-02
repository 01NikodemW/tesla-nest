import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({ description: 'Make of the vehicle', example: 'Toyota' })
  make: string;

  @ApiProperty({ description: 'Model of the vehicle', example: 'Corolla' })
  model: string;

  @ApiProperty({ description: 'Year of manufacture', example: 2022 })
  year: number;

  @ApiProperty({
    description: 'Rental price per day in USD',
    example: 50,
  })
  rentalPricePerDay: number;
}
