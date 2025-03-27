import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

  async getUsers() {
    const { data, error } = await this.supabase.from('users').select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}
