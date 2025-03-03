import { Controller, Post, Req, Res, Headers } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Response, Request } from 'express';

@Controller('webhooks')
export class StripeWebhookController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('stripe')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      await this.stripeService.processWebhook(req, signature);
      res.status(200).send('Webhook received');
    } catch (err) {
      res.status(400).send(`Webhook error: ${err.message}`);
    }
  }
}
