import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReservationsService } from './reservations.service';
import { ReservationStatus } from './entities/reservation.entity';

@Injectable()
export class ReservationCronService {
  private readonly logger = new Logger(ReservationCronService.name);

  constructor(private readonly reservationsService: ReservationsService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleExpiredReservations() {
    this.logger.log('🔍 Checking for expired reservations...');

    const expiredReservations =
      await this.reservationsService.findExpiredReservations();
    const expiredIds = expiredReservations.map((reservation) => reservation.id);

    if (expiredIds.length > 0) {
      await this.reservationsService.markAsExpired(expiredIds);
      this.logger.log(
        `✅ Marked ${expiredIds.length} reservations as EXPIRED.`,
      );
    } else {
      this.logger.log('✅ No expired reservations found.');
    }
  }
}
