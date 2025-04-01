/**
 * Unit tests for CompaniesController
 *
 * Validates CompaniesController functionality:
 * - Controller initialization
 * - Interaction with CompaniesService
 * - findOne method behavior
 *
 * Covers key scenarios:
 * - Successful company data retrieval
 * - Handling of different input types
 * - Method delegation
 */
import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let companiesServiceMock: Partial<CompaniesService>;

  beforeEach(async () => {
    companiesServiceMock = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        {
          provide: CompaniesService,
          useValue: companiesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return company data for a given ID', async () => {
      const companyId = 1;
      const mockCompanyData = {
        id: companyId,
        name: 'Test Company',
        industry: 'Technology',
      };

      (companiesServiceMock.findOne as jest.Mock).mockResolvedValue(
        mockCompanyData,
      );

      const result = await controller.findOne(companyId.toString());

      expect(companiesServiceMock.findOne).toHaveBeenCalledWith(companyId);
      expect(result).toEqual(mockCompanyData);
    });

    it('should handle null/undefined result from service', async () => {
      const companyId = 2;

      (companiesServiceMock.findOne as jest.Mock).mockResolvedValue(null);

      const result = await controller.findOne(companyId.toString());

      expect(companiesServiceMock.findOne).toHaveBeenCalledWith(companyId);
      expect(result).toBeNull();
    });
  });
});
