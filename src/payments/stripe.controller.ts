import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StripeService } from './stripe.service';
import { StripeExceptionFilter } from './filters/stripe-exception.filter';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

@ApiTags('Payments')
@UseFilters(StripeExceptionFilter)
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
    @Body() createPaymentIntentDto: CreatePaymentIntentDto,
  ) {
    const paymentIntent = await this.stripeService.createPaymentIntent(
      createPaymentIntentDto,
    );
    return { clientSecret: paymentIntent.client_secret };
  }
}
