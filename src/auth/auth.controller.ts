import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth') // Group endpoints under the "Auth" section in Swagger
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Log in to the application' })
  @ApiResponse({
    status: 200,
    description: 'Login successful. Returns a JWT token.',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'email@gmail.com' },
        password: { type: 'string', example: '@Haslo123' },
      },
    },
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'email@gmail.com' },
        password: { type: 'string', example: '@Haslo123' },
      },
    },
  })
  async register(@Body() body: { email: string; password: string }) {
    return this.authService.register(body.email, body.password);
  }
}
