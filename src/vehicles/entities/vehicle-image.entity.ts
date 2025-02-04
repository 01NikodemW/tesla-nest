import { Entity, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Vehicle } from './vehicle.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class VehicleImage extends BaseEntity {
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
