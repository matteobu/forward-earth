import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getUserInfoById(userId: string) {
    const user: User = await this.supabaseService.getUserByEmail(userId);
    return user;
  }
}
