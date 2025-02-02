import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    const logDirectory = path.join(__dirname, '../../logs');

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
          ({ timestamp, level, message }) =>
            `${timestamp} [${level.toUpperCase()}]: ${message}`,
        ),
      ),
      transports: [
        // ✅ Console logging
        new winston.transports.Console(),

        // ✅ File logging with daily rotation
        new winston.transports.DailyRotateFile({
          filename: `${logDirectory}/%DATE%/app.log`,
          datePattern: 'YYYY-MM-DD',
          maxFiles: '30d',
          zippedArchive: true,
          level: 'info', // ✅ Ensure this is correct
        }),
      ],
    });

    this.logger.info('LoggerService initialized'); // ✅ Test log when service starts
  }

  log(message: string) {
    this.logger.info(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  error(message: string) {
    this.logger.error(message);
  }
}
