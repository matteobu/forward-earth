// users.service.ts
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  // Retrieve user information by ID or email
  async getUserInfoById(userId: string) {
    const user: User = await this.supabaseService.getUserByEmail(userId);
    return user;
  }
}
