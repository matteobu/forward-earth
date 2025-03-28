import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly supabaseService: SupabaseService,
  ) {}

  // Validate the user and generate JWT token
  async validateUser(email: string, name: string) {
    // Check if user exists in Supabase
    let user = await this.supabaseService.getUserByEmail(email);

    // If user doesn't exist, create one
    if (!user) {
      user = await this.supabaseService.createUser(name, email);
    }

    const payload = { email: user.email, sub: user.id }; // Customize this as per your needs
    const token = this.jwtService.sign(payload);

    return { user, token };
  }
}
