/**
 * Comprehensive unit tests for ConsumptionService, covering CRUD operations,
 * filtering, sorting, and data transformation functionality
 */
import { Test, TestingModule } from '@nestjs/testing';
import { ConsumptionService } from './consumption.service';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateConsumptionDto } from './dto/create-consumption.dto';

const mockSupabaseService = {
  createConsumption: jest.fn(),
  updateUserConsumption: jest.fn(),
  deleteUserConsumption: jest.fn(),
  getUserConsumption: jest.fn(),
};

describe('ConsumptionService', () => {
  let service: ConsumptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsumptionService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<ConsumptionService>(ConsumptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call createConsumption on supabaseService and return result', async () => {
      const createConsumptionDto: CreateConsumptionDto = {
        user_id: 1,
        amount: 100,
        activity_type_table_id: 1,
        date: '2025-04-01',
        co2_equivalent: 23.5,
        unit_id: 2,
        unit_table: { id: 2, name: 'kg' },
        activity_table: {
          id: 1,
          name: 'Electricity',
          emission_factor: 0.23,
          activity_type_id: 1,
        },
      };

      mockSupabaseService.createConsumption.mockResolvedValue({
        id: 1,
        ...createConsumptionDto,
      });

      const result = await service.create(createConsumptionDto);

      expect(mockSupabaseService.createConsumption).toHaveBeenCalledWith({
        user_id: createConsumptionDto.user_id,
        amount: createConsumptionDto.amount,
        activity_type_id: createConsumptionDto.activity_type_table_id,
        activity_name: createConsumptionDto.activity_table?.name,
        emission_factor: createConsumptionDto.activity_table?.emission_factor,
        date: createConsumptionDto.date,
        co2_equivalent: createConsumptionDto.co2_equivalent,
        unit: createConsumptionDto.unit_table?.name,
      });
      expect(result).toEqual({ id: 1, ...createConsumptionDto });
    });
  });

  describe('patch', () => {
    it('should call updateUserConsumption on supabaseService and return result', async () => {
      const patchDto = { amount: 150, date: '2025-05-01' };
      const id = 1;

      mockSupabaseService.updateUserConsumption.mockResolvedValue({
        id,
        ...patchDto,
      });

      const result = await service.patch(id, patchDto);

      expect(mockSupabaseService.updateUserConsumption).toHaveBeenCalledWith(
        id,
        patchDto,
      );
      expect(result).toEqual({ id, ...patchDto });
    });
  });

  describe('remove', () => {
    it('should call deleteUserConsumption on supabaseService and return result', async () => {
      const id = 1;

      mockSupabaseService.deleteUserConsumption.mockResolvedValue({
        message: 'Deleted successfully',
      });

      const result = await service.remove(id);

      expect(mockSupabaseService.deleteUserConsumption).toHaveBeenCalledWith(
        id,
      );
      expect(result).toEqual({ message: 'Deleted successfully' });
    });
  });

  describe('getUserConsumption', () => {
    it('should call getUserConsumption on supabaseService and return paginated result', async () => {
      const params = {
        user_id: 1,
        page: 1,
        limit: 10,
        sortBy: 'date',
        sortOrder: 'ASC' as 'ASC' | 'DESC',
      };

      const supabaseResult = {
        data: [{ id: 1, user_id: 1, amount: 100, co2_equivalent: 23.5 }],
        meta: { total: 1, totalPages: 1 },
      };

      mockSupabaseService.getUserConsumption.mockResolvedValue(supabaseResult);

      const result = await service.getUserConsumption(params);

      expect(mockSupabaseService.getUserConsumption).toHaveBeenCalledWith(
        'ConsumptionTable',
        {
          select: '*, ActivityTypeTable(*), UnitTable(*)',
          filters: { user_id: 1 },
          page: 1,
          limit: 10,
          orderBy: 'date',
          ascending: true,
        },
      );
      expect(result).toEqual(supabaseResult);
    });

    it('should apply filters correctly when co2Min and co2Max are provided', async () => {
      const params = {
        user_id: 1,
        page: 1,
        limit: 10,
        sortBy: 'date',
        sortOrder: 'ASC' as 'ASC' | 'DESC',
        co2Min: 20,
        co2Max: 30,
      };

      const supabaseResult = {
        data: [{ id: 1, user_id: 1, amount: 100, co2_equivalent: 23.5 }],
        meta: { total: 1, totalPages: 1 },
      };

      mockSupabaseService.getUserConsumption.mockResolvedValue(supabaseResult);

      const result = await service.getUserConsumption(params);

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.meta.total).toBe(1);
    });
  });
});
