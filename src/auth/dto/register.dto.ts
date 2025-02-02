import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'email@gmail.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '@Haslo123', description: 'User password', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
