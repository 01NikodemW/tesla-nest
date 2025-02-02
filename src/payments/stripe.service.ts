import { Injectable, Inject } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(@Inject('STRIPE_CLIENT') private readonly stripe: Stripe) {}

  async createPaymentIntent(
    amount: number,
    currency: string,
    customerEmail: string,
  ) {
    return await this.stripe.paymentIntents.create({
      amount,
      currency,
      receipt_email: customerEmail,
    });
  }
}
