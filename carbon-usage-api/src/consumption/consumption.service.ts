import { Injectable } from '@nestjs/common';
import { CreateConsumptionDto } from './dto/create-consumption.dto';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class ConsumptionService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createConsumptionDto: CreateConsumptionDto) {
    return this.supabaseService.createConsumption({
      user_id: createConsumptionDto.user_id,
      amount: createConsumptionDto.amount,
      activity_type_id: createConsumptionDto.activity_type_id,
      activity_name: createConsumptionDto.activity_name,
      emission_factor: createConsumptionDto.emission_factor,
      date: createConsumptionDto.date,
      co2_equivalent: createConsumptionDto.co2_equivalent,
      unit: createConsumptionDto.unit,
    });
  }

  findAll() {
    return `This action returns all consumption`;
  }

  findOne(id: number) {
    return `This action returns a #${id} consumption`;
  }

  update(id: number) {
    return `This action updates a #${id} consumption`;
  }

  remove(id: number) {
    return this.supabaseService.deleteUserConsumption(id);
  }

  async getUserConsumption(user_id: number) {
    return this.supabaseService.getUserConsumption(user_id);
  }
}
