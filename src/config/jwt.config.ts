import { registerAs } from '@nestjs/config';

export default registerAs('jwtConfig', () => ({
  jwtSecret: process.env.JWT_SECRET,
}));
