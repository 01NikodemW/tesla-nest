import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VehiclesModule } from './vehicles/vehicles.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SeedModule } from './database/seed.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import enviromentValidation from './config/enviroment.validation';
import jwtConfig from './config/jwt.config';
import { ReservationsModule } from './reservations/reservations.module';
import { AzureStorageModule } from './azure-storage/azure-storage.module';
import azureConfig from './config/azure.config';
import stripeConfig from './config/stripe.config';
import { StripeModule } from './payments/stripe.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from './logger/logger.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AdminModule } from './admin/admin.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    LoggerModule,
    AdminModule,
    AzureStorageModule,
    VehiclesModule,
    AuthModule,
    ReservationsModule,
    UsersModule,
    SeedModule,
    StripeModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [databaseConfig, jwtConfig, azureConfig, stripeConfig],
      validationSchema: enviromentValidation,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 50,
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('database.url'),
        synchronize: configService.get('database.synchronize'),
        autoLoadEntities: configService.get('database.autoLoadEntities'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('cats');
  }
}
