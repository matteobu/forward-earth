import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: ReturnType<typeof createClient>;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Supabase URL or Key is not defined in environment variables.',
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getUsers(): Promise<any[]> {
    const {
      data,
      error,
    }: { data: any[] | null; error: { message?: string } | null } =
      await this.supabase.from('users').select('*');

    if (error) {
      const errorMessage =
        error.message && typeof error.message === 'string'
          ? error.message
          : 'An unknown error occurred';
      throw new Error(errorMessage);
    }

    return data as any[];
  }

  async insertUser(name: string, email: string) {
    console.log('Inserting user with name:', name, 'and email:', email);

    const response = await this.supabase.from('User').insert([{ name, email }]);

    console.log('Supabase response:', response);

    if (response.error) {
      console.error('Error from Supabase:', response.error);
      throw new Error(`Error inserting user: ${response.error.message}`);
    }

    return response.data;
  }
}
