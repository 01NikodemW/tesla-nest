import { IsInt, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleImageDto {
  @ApiProperty({ description: 'Vehicle ID', example: 1 })
  @IsInt()
  vehicleId: number;

  @ApiProperty({
    description: 'Image URL',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsUrl()
  imageUrl: string;
}
