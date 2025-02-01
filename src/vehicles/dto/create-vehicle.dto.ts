import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsInt()
  @Min(1886)
  @Max(new Date().getFullYear())
  year: number;

  @IsInt()
  @Min(0)
  rentalPricePerDay: number;
}
