import { Test, TestingModule } from '@nestjs/testing';
import { ProductionService } from './production.service';
import { SupabaseService } from '../supabase/supabase.service';

describe('ProductionService', () => {
  let service: ProductionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupabaseService, ProductionService],
    }).compile();

    service = module.get<ProductionService>(ProductionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
