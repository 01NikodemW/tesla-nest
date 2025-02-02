import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';

@Module({
  imports: [ConfigModule],
  controllers: [StripeController],
  providers: [
    {
      provide: 'STRIPE_CLIENT',
      useFactory: (configService: ConfigService) => {
        const stripe = require('stripe')(
          configService.get<string>('STRIPE_SECRET_KEY'),
        );
        return stripe;
      },
      inject: [ConfigService],
    },
    StripeService,
  ],
  exports: [StripeService],
})
export class StripeModule {}
