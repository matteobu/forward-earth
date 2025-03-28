import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createUserDto: { name: string; email: string; token?: string }) {
    const { name, email, token } = createUserDto;

    try {
      if (!email) {
        throw new UnauthorizedException('Email is required');
      }

      if (token) {
        const decodedToken = this.supabaseService.verifyJWT(token);

        if (decodedToken && decodedToken.email === email) {
          const existingUser =
            await this.supabaseService.findUserByEmail(email);
          return {
            message: 'User authenticated successfully',
            user: existingUser,
            jwt: token,
          };
        }
      }

      const existingUser = await this.supabaseService.findUserByEmail(email);

      if (existingUser) {
        const newToken = this.supabaseService.createJWT({
          id: existingUser.id as string,
          email: existingUser.email as string,
        });
        return {
          message: 'User already exists',
          user: existingUser,
          jwt: newToken,
        };
      }

      const user = await this.supabaseService.insertUser(name, email);

      const jwtToken = this.supabaseService.createJWT({
        id: user.id as string,
        email: user.email as string,
      });

      return {
        message: 'User created successfully!',
        user: user,
        jwt: jwtToken,
      };
    } catch (error) {
      console.error('Error in user creation/authentication:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
