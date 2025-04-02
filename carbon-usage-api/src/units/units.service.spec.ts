/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UnitsService } from './units.service';
import { SupabaseService } from '../supabase/supabase.service';

/**
 * Unit tests for the UnitsService class which handles unit-related business logic
 * and interacts with the SupabaseService for data operations.
 */
describe('UnitsService', () => {
  let service: UnitsService;
  let supabaseService: SupabaseService;

  const mockUnits = [
    { id: 1, name: 'Unit 1' },
    { id: 2, name: 'Unit 2' },
  ];

  beforeEach(async () => {
    const mockSupabaseService = {
      getAllUnit: jest.fn().mockResolvedValue(mockUnits),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<UnitsService>(UnitsService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of units', async () => {
      const result = await service.findAll();

      expect(supabaseService.getAllUnit).toHaveBeenCalled();
      expect(result).toEqual(mockUnits);
    });
  });

  describe('findAll error handling', () => {
    it('should handle exceptions', async () => {
      jest
        .spyOn(supabaseService, 'getAllUnit')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(service.findAll()).rejects.toThrow('Database error');
    });
  });
});
