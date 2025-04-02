/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';

/**
 * Unit tests for the UnitsController class which handles unit-related HTTP requests
 * and delegates business logic to the UnitsService.
 */
describe('UnitsController', () => {
  let controller: UnitsController;
  let service: UnitsService;

  const mockUnits = [
    { id: 1, name: 'Unit 1' },
    { id: 2, name: 'Unit 2' },
  ];

  beforeEach(async () => {
    const mockUnitsService = {
      findAll: jest.fn().mockResolvedValue(mockUnits),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitsController],
      providers: [
        {
          provide: UnitsService,
          useValue: mockUnitsService,
        },
      ],
    }).compile();

    controller = module.get<UnitsController>(UnitsController);
    service = module.get<UnitsService>(UnitsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of units', async () => {
      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUnits);
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
