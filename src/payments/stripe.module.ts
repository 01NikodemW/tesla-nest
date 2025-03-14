import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { StripeWebhookController } from './webhook.controller';

@Module({
  controllers: [StripeController, StripeWebhookController], // Register webhook controller
  providers: [
    {
      provide: 'STRIPE_CLIENT',
      useFactory: (configService: ConfigService) => {
        return require('stripe')(
          configService.get<string>('STRIPE_SECRET_KEY'),
        );
      },
      inject: [ConfigService],
    },
    StripeService,
  ],
})
export class StripeModule {}
