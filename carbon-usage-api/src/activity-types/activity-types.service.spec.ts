/**
 * Unit tests for ActivityTypesService
 *
 * This test suite covers the functionality of the ActivityTypesService,
 * focusing on the findAll method. It verifies interaction with SupabaseService,
 * handling of successful data retrieval, empty results, and error scenarios.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { ActivityTypesService } from './activity-types.service';
import { SupabaseService } from '../supabase/supabase.service';

describe('ActivityTypesService', () => {
  let service: ActivityTypesService;
  let supabaseServiceMock: Partial<SupabaseService>;

  beforeEach(async () => {
    supabaseServiceMock = {
      getAllActivityType: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityTypesService,
        {
          provide: SupabaseService,
          useValue: supabaseServiceMock,
        },
      ],
    }).compile();

    service = module.get<ActivityTypesService>(ActivityTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should call supabaseService.getAllActivityType', async () => {
      const mockActivityTypes = [
        { id: 1, name: 'Type 1' },
        { id: 2, name: 'Type 2' },
      ];

      (supabaseServiceMock.getAllActivityType as jest.Mock).mockResolvedValue(
        mockActivityTypes,
      );

      const result = await service.findAll();

      expect(supabaseServiceMock.getAllActivityType).toHaveBeenCalled();

      expect(result).toEqual(mockActivityTypes);
    });

    it('should handle empty results', async () => {
      (supabaseServiceMock.getAllActivityType as jest.Mock).mockResolvedValue(
        [],
      );

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should propagate errors from supabaseService', async () => {
      const errorMessage = 'Database connection error';
      (supabaseServiceMock.getAllActivityType as jest.Mock).mockRejectedValue(
        new Error(errorMessage),
      );
      await expect(service.findAll()).rejects.toThrow(errorMessage);
    });
  });
});
