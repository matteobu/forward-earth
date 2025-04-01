/**
 * Unit tests for CompaniesService
 *
 * Validates CompaniesService functionality:
 * - Service initialization
 * - Interaction with SupabaseService
 * - findOne method behavior
 *
 * Covers key scenarios:
 * - Successful data retrieval
 * - Handling of null/undefined results
 * - Method delegation
 */
import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { SupabaseService } from '../supabase/supabase.service';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let supabaseServiceMock: Partial<SupabaseService>;

  beforeEach(async () => {
    supabaseServiceMock = {
      getCompanyData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: SupabaseService,
          useValue: supabaseServiceMock,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return company data for a given user ID', async () => {
      const userId = 1;
      const mockCompanyData = {
        id: userId,
        name: 'Test Company',
        industry: 'Technology',
      };

      (supabaseServiceMock.getCompanyData as jest.Mock).mockResolvedValue(
        mockCompanyData,
      );

      const result = await service.findOne(userId);

      expect(supabaseServiceMock.getCompanyData).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockCompanyData);
    });

    it('should handle null/undefined result from Supabase', async () => {
      const userId = 2;

      (supabaseServiceMock.getCompanyData as jest.Mock).mockResolvedValue(null);

      const result = await service.findOne(userId);

      expect(supabaseServiceMock.getCompanyData).toHaveBeenCalledWith(userId);
      expect(result).toBeNull();
    });
  });
});
