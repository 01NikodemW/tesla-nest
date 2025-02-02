import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
}));
