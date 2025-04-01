import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ActivityTypesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  findAll() {
    return this.supabaseService.getAllActivityType();
  }
}
