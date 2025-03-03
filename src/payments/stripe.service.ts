import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

@Injectable()
export class StripeService {
  constructor(
    @Inject('STRIPE_CLIENT') private readonly stripe: Stripe,
    private readonly configService: ConfigService,
  ) {}

  async createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto) {
    const { amount, currency, email } = createPaymentIntentDto;

    // Convert amount to the smallest unit (Stripe expects it in cents)
    const amountInSmallestUnit = this.convertAmountToSmallestUnit(
      amount,
      currency,
    );

    return await this.stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency,
      receipt_email: email,
    });
  }

  private convertAmountToSmallestUnit(
    amount: number,
    currency: string,
  ): number {
    const currenciesWithCents = ['usd', 'eur', 'gbp', 'pln', 'cad']; // Add more if needed

    if (currenciesWithCents.includes(currency.toLowerCase())) {
      return Math.round(amount * 100);
    }

    return Math.round(amount); // For currencies that don't use subunits (like JPY)
  }

  async processWebhook(req: any, signature: string) {
    const endpointSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    let event;
    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        endpointSecret,
      );
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('✅ Payment confirmed:', event.data.object);
        // await this.updatePaymentStatus(event.data.object, 'succeeded');
        break;
      case 'payment_intent.payment_failed':
        console.log('❌ Payment failed:', event.data.object);
        // await this.updatePaymentStatus(event.data.object, 'failed');
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }
  }

  // private async updatePaymentStatus(paymentIntent: any, status: string) {
  //   const reservationId = paymentIntent.metadata?.reservationId;
  //   if (reservationId) {
  //     await this.reservationRepository.update(reservationId, {
  //       paymentStatus: status,
  //     });
  //   }
  // }
}
