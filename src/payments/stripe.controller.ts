import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StripeService } from './stripe.service';

@ApiTags('Payments')
@Controller('payments')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-intent')
  @ApiOperation({ summary: 'Tworzy PaymentIntent w Stripe' })
  @ApiResponse({
    status: 201,
    description: 'Zwraca client_secret do finalizacji płatności',
  })
  async createPaymentIntent(
    @Body() body: { amount: number; currency: string; email: string },
  ) {
    const paymentIntent = await this.stripeService.createPaymentIntent(
      body.amount,
      body.currency,
      body.email,
    );
    return { clientSecret: paymentIntent.client_secret };
  }
}
