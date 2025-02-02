import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { User } from '../users/entities/user.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const { userId, vehicleId, rentalDate, returnDate } = createReservationDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const vehicle = await this.vehicleRepository.findOne({
      where: { id: vehicleId },
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    if (dayjs(rentalDate).isAfter(returnDate)) {
      throw new BadRequestException(
        'Rental date must be before or the same as return date',
      );
    }

    const existingReservation = await this.reservationRepository.findOne({
      where: {
        vehicle: { id: vehicleId },
        rentalDate: Between(rentalDate, returnDate),
      },
    });

    if (existingReservation) {
      throw new BadRequestException(
        `This vehicle is already reserved from ${existingReservation.rentalDate} to ${existingReservation.returnDate}`,
      );
    }

    const rentalDays = dayjs(returnDate).diff(rentalDate, 'day') + 1;
    const totalPrice = rentalDays * vehicle.rentalPricePerDay;

    const reservation = this.reservationRepository.create({
      user,
      vehicle,
      rentalDate,
      returnDate,
      totalPrice,
    });

    return this.reservationRepository.save(reservation);
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find({ relations: ['user', 'vehicle'] });
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['user', 'vehicle'],
    });

    if (!reservation) throw new NotFoundException('Reservation not found');

    return reservation;
  }

  async update(
    id: number,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    const reservation = await this.findOne(id);

    const { rentalDate, returnDate, vehicleId } = updateReservationDto;

    if (rentalDate && returnDate) {
      if (dayjs(rentalDate).isAfter(returnDate)) {
        throw new BadRequestException(
          'Rental date must be before or the same as return date',
        );
      }

      const conflictingReservation = await this.reservationRepository.findOne({
        where: {
          vehicle: { id: vehicleId ?? reservation.vehicle.id },
          rentalDate: Between(rentalDate, returnDate),
        },
      });

      if (conflictingReservation && conflictingReservation.id !== id) {
        throw new BadRequestException(
          `This vehicle is already reserved from ${conflictingReservation.rentalDate} to ${conflictingReservation.returnDate}`,
        );
      }

      const updatedRentalDays = dayjs(returnDate).diff(rentalDate, 'day') + 1;
      reservation.totalPrice =
        updatedRentalDays * reservation.vehicle.rentalPricePerDay;
    }

    Object.assign(reservation, updateReservationDto);
    return this.reservationRepository.save(reservation);
  }

  async delete(id: number): Promise<void> {
    const reservation = await this.findOne(id);
    await this.reservationRepository.remove(reservation);
  }
}
