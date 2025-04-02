/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { SupabaseService } from '../supabase/supabase.service';

/**
 * Unit tests for the ProductsService class which handles product-related business logic
 * and interacts with the SupabaseService for data operations.
 */
describe('ProductsService', () => {
  let service: ProductsService;
  let supabaseService: SupabaseService;

  const mockProducts = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 },
  ];

  beforeEach(async () => {
    const mockSupabaseService = {
      getProductsData: jest.fn().mockResolvedValue(mockProducts),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = await service.findAll();

      expect(supabaseService.getProductsData).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });
  });

  describe('findAll error handling', () => {
    it('should handle exceptions', async () => {
      jest
        .spyOn(supabaseService, 'getProductsData')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(service.findAll()).rejects.toThrow('Database error');
    });
  });
});
