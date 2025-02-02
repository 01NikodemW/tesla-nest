import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Vehicle } from './vehicle.entity';

@Entity()
export class VehicleImage {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier for the image', example: 1 })
  id: number;

  @Column()
  @ApiProperty({
    description: 'URL of the vehicle image',
    example: 'https://example.com/car.jpg',
  })
  imageUrl: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.images, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({ description: 'Associated vehicle', type: () => Vehicle }) // ✅ FIX: Lazy resolver
  vehicle: Vehicle;
}
