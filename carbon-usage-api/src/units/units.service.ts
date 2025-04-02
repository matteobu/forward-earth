import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UnitsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  findAll() {
    return this.supabaseService.getAllUnit();
  }
}
