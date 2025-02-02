import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier for the vehicle', example: 1 })
  id: number;

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
}
