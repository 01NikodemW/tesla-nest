import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { User } from '../users/entities/user.entity';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { ReservationCronService } from './reservation-cron.service';
import { LoggerModule } from 'src/logger/logger.module';
import { CreateReservationHandler } from './commands/create-reservation/create-reservation.handler';
import { UpdateReservationHandler } from './commands/update-reservation/update-reservation.handler';
import { DeleteReservationHandler } from './commands/delete-reservation/delete-reservation.handler';
import { GetReservationsHandler } from './queries/get-reservations/get-reservations.handler';
import { GetReservationsByIdHandler } from './queries/get-reservation-by-id/get-reservation-by-id.handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Reservation, Vehicle, User]),
    PaginationModule,
    LoggerModule,
  ],
  controllers: [ReservationsController],
  providers: [
    ReservationsService,
    ReservationCronService,
    CreateReservationHandler,
    UpdateReservationHandler,
    DeleteReservationHandler,
    GetReservationsHandler,
    GetReservationsByIdHandler,
  ],
})
export class ReservationsModule {}
