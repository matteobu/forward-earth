import {
  Controller,
  Post,
  Get,
  Req,
  Res,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() { email, name }, @Res() res: Response) {
    try {
      const result = await this.authService.validateUser(email, name, res);

      res.cookie('jwt', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000,
        path: '/',
      });

      return res.json({ user: result.user });
    } catch (error) {
      console.error('Login error:', error);
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  @Get('me')
  async getProfile(@Req() req: Request) {
    const token = req.cookies['jwt'];
    if (!token) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      const user = await this.authService.verifyToken(token as string);
      console.log('User verified:', user);
      return { user };
    } catch (error) {
      console.error('Token verification error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    res.json({ message: 'Logged out successfully' });
  }
}
