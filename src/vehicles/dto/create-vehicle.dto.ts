import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ description: 'Make of the vehicle', example: 'Toyota' })
  @IsString()
  make: string;

  @ApiProperty({ description: 'Model of the vehicle', example: 'Corolla' })
  @IsString()
  model: string;

  @ApiProperty({ description: 'Year of manufacture', example: 2022 })
  @IsInt()
  @Min(1900)
  @Max(2100)
  year: number;

  @ApiProperty({
    description: 'Rental price per day in USD',
    example: 50,
  })
  @IsInt()
  @Min(1)
  rentalPricePerDay: number;
}
