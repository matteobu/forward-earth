// users.service.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createUserDto: { name: string; email: string }) {
    const { name, email } = createUserDto;

    const user = await this.supabaseService.insertUser(name, email);

    return {
      message: 'User created successfully!',
      user: user,
    };
  }
}
