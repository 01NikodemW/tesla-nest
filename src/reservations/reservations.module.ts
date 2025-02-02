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

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Vehicle, User]),
    PaginationModule,
    LoggerModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationCronService],
})
export class ReservationsModule {}
