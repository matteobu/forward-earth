import { Response } from 'express'; // Make sure to import this
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

    // If user doesn't exist, create one
    if (!user) {
      user = await this.supabaseService.createUser(name, email);
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
    });

    return { user, token };
  }
  verifyToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
    }
  }
}
