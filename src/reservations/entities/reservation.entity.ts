import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Unique identifier for the reservation',
    example: 1,
  })
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @ApiProperty({ description: 'User who made the reservation', example: 1 })
  user: User;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.id)
  @ApiProperty({ description: 'Vehicle reserved by the user', example: 2 })
  vehicle: Vehicle;

  @Column({ type: 'date' })
  @ApiProperty({ description: 'Rental start date', example: '2025-02-10' })
  rentalDate: string;

  @Column({ type: 'date' })
  @ApiProperty({ description: 'Return date', example: '2025-02-15' })
  returnDate: string;

  @Column()
  @ApiProperty({
    description: 'Total price of the reservation',
    example: 250,
  })
  totalPrice: number;
}
