import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual } from 'typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { User } from '../users/entities/user.entity';
import * as dayjs from 'dayjs';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { LoggerService } from 'src/logger/logger.service';
import { ReservationConflictException } from 'src/exceptions/reservation-conflict.exception';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly paginationService: PaginationService,
    private readonly loggerService: LoggerService,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    this.loggerService.log(
      `Creating reservation: ${JSON.stringify(createReservationDto)}`,
    );

    const { userId, vehicleId, rentalDate, returnDate } = createReservationDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.loggerService.warn(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    const vehicle = await this.vehicleRepository.findOne({
      where: { id: vehicleId },
    });
    if (!vehicle) {
      this.loggerService.warn(`Vehicle with ID ${vehicleId} not found`);
      throw new NotFoundException('Vehicle not found');
    }

    if (dayjs(rentalDate).isAfter(returnDate)) {
      this.loggerService.warn('Invalid rental period');
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
      this.loggerService.warn(
        `Vehicle ${vehicleId} is already reserved from ${existingReservation.rentalDate} to ${existingReservation.returnDate}`,
      );
      throw new ReservationConflictException(
        vehicleId,
        existingReservation.rentalDate,
        existingReservation.returnDate,
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

    const savedReservation = await this.reservationRepository.save(reservation);
    this.loggerService.log(
      `Reservation created with ID: ${savedReservation.id}`,
    );

    return savedReservation;
  }

  async findAll(paginationDto: PaginationDto) {
    this.loggerService.log(
      `Fetching all reservations with pagination: ${JSON.stringify(paginationDto)}`,
    );

    const queryBuilder = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.user', 'user')
      .leftJoinAndSelect('reservation.vehicle', 'vehicle');

    const result = await this.paginationService.paginate(
      queryBuilder,
      paginationDto,
      'reservation',
    );

    this.loggerService.log(`Fetched ${result.data.length} reservations`);
    return result;
  }

  async findOne(id: number): Promise<Reservation> {
    this.loggerService.log(`Fetching reservation with ID: ${id}`);

    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['user', 'vehicle'],
    });

    if (!reservation) {
      this.loggerService.warn(`Reservation with ID ${id} not found`);
      throw new NotFoundException('Reservation not found');
    }

    this.loggerService.log(`Reservation found: ${JSON.stringify(reservation)}`);
    return reservation;
  }

  async update(
    id: number,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    this.loggerService.log(
      `Updating reservation ID ${id} with data: ${JSON.stringify(updateReservationDto)}`,
    );

    const reservation = await this.findOne(id);
    const { rentalDate, returnDate, vehicleId } = updateReservationDto;

    if (rentalDate && returnDate) {
      if (dayjs(rentalDate).isAfter(returnDate)) {
        this.loggerService.warn('Invalid rental period');
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
        this.loggerService.warn(
          `Conflict: Vehicle ${vehicleId} is already reserved from ${conflictingReservation.rentalDate} to ${conflictingReservation.returnDate}`,
        );
        throw new ReservationConflictException(
          vehicleId,
          conflictingReservation.rentalDate,
          conflictingReservation.returnDate,
        );
      }

      const updatedRentalDays = dayjs(returnDate).diff(rentalDate, 'day') + 1;
      reservation.totalPrice =
        updatedRentalDays * reservation.vehicle.rentalPricePerDay;
    }

    Object.assign(reservation, updateReservationDto);
    const updatedReservation =
      await this.reservationRepository.save(reservation);

    this.loggerService.log(`Reservation ID ${id} updated successfully`);
    return updatedReservation;
  }

  async delete(id: number): Promise<void> {
    this.loggerService.warn(`Deleting reservation with ID: ${id}`);

    const reservation = await this.findOne(id);
    await this.reservationRepository.remove(reservation);

    this.loggerService.warn(`Reservation with ID ${id} deleted`);
  }

  async findExpiredReservations(): Promise<Reservation[]> {
    this.loggerService.log('Fetching expired reservations');
    return this.reservationRepository.find({
      where: {
        returnDate: LessThanOrEqual(new Date().toISOString().split('T')[0]),
        status: ReservationStatus.IN_PROGRESS,
      },
    });
  }

  async markAsExpired(ids: number[]): Promise<void> {
    if (ids.length > 0) {
      this.loggerService.log(
        `Marking reservations as expired: ${ids.join(', ')}`,
      );
      await this.reservationRepository.update(ids, {
        status: ReservationStatus.OVERDUE,
      });
    }
  }
}
