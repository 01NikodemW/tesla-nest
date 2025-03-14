import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsString, Min } from 'class-validator';

export class CreatePaymentIntentDto {
  @ApiProperty({ example: 10, description: 'Amount of payment' })
  @IsInt()
  @Min(1, { message: 'Amount must be greater than 0' })
  amount: number;

  @ApiProperty({ example: 'usd', description: 'Currency of payment' })
  @IsString()
  currency: string;

  @ApiProperty({ example: 'test@test.com', description: 'User email' })
  @IsEmail()
  email: string;
}
