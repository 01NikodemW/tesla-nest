import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleImage } from './vehicle-image.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class Vehicle extends BaseEntity {
  @Column()
  @ApiProperty({ description: 'Make of the vehicle', example: 'Toyota' })
  make: string;

  @Column()
  @ApiProperty({ description: 'Model of the vehicle', example: 'Corolla' })
  model: string;

  @Column()
  @ApiProperty({ description: 'Year of manufacture', example: 2022 })
  year: number;

  @Column()
  @ApiProperty({
    description: 'Rental price per day in USD',
    example: 50,
  })
  rentalPricePerDay: number;

  @OneToMany(() => VehicleImage, (vehicleImage) => vehicleImage.vehicle, {
    cascade: true,
  })
  @ApiProperty({
    description: 'List of vehicle images',
    type: () => [VehicleImage],
  }) // ✅ FIX: Lazy resolver
  images: VehicleImage[];
}
