import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('test')
  testRoute() {
    return { message: 'Test route hit' }; // A simple test message
  }

  @Post('login')
  async login(@Body() { email, name }) {
    const result = await this.authService.validateUser(email, name);
    return result; // Returns user info and JWT token
  }
}
