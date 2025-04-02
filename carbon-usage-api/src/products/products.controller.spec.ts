/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

/**
 * Unit tests for the ProductsController class which handles product-related HTTP requests
 * and delegates business logic to the ProductsService.
 */
describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProducts = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 },
  ];

  beforeEach(async () => {
    const mockProductsService = {
      findAll: jest.fn().mockResolvedValue(mockProducts),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });
  });

  describe('findAll error handling', () => {
    it('should handle exceptions', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(controller.findAll()).rejects.toThrow('Database error');
    });
  });
});
