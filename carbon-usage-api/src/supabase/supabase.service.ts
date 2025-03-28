import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

interface UserPayload {
  sub: string;
  email: string;
  exp?: number;
  iat?: number;
}

@Injectable()
export class SupabaseService {
  private supabase: ReturnType<typeof createClient>;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration is incomplete');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async findUserByEmail(email: string) {
    const { data, error } = await this.supabase
      .from('Users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  }

  async insertUser(name: string, email: string) {
    const { data, error } = await this.supabase
      .from('Users')
      .insert([{ name, email }])
      .select();

    if (error || !data) {
      throw new Error(`User insertion failed: ${error?.message}`);
    }

    return data[0];
  }

  createJWT(user: { id: string; email: string }) {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      throw new Error('JWT secret is not configured');
    }

    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return jwt.sign(payload, secretKey, {
      expiresIn: '60m',
      algorithm: 'HS256',
    });
  }

  verifyJWT(token: string): UserPayload {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      throw new Error('JWT secret is not configured');
    }

    try {
      return jwt.verify(token, secretKey, {
        algorithms: ['HS256'],
      }) as UserPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
