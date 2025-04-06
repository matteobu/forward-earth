import { Test, TestingModule } from '@nestjs/testing';
import { ProductionController } from './production.controller';
import { ProductionService } from './production.service';
import { SupabaseService } from '../supabase/supabase.service';

describe('ProductionController', () => {
  let controller: ProductionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductionController],
      providers: [SupabaseService, ProductionService],
    }).compile();

    controller = module.get<ProductionController>(ProductionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
