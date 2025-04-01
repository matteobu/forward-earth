import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CompaniesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  findOne(userId: number) {
    return this.supabaseService.getCompanyData(userId);
  }
}
