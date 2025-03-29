import { Response } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async validateUser(email: string, name: string, res: Response) {
    let user = await this.supabaseService.getUserByEmail(email);

    if (!user) {
      user = await this.supabaseService.createUser(name, email);
    }

    const payload = {
      email: user.email,
      sub: user.id,
      name: user.name || name,
    };

    const token = this.jwtService.sign(payload);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
      path: '/',
    });

    return { user, token };
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      await Promise.resolve();
      return {
        userId: payload.sub,
        email: payload.email,
        name: payload.name,
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
