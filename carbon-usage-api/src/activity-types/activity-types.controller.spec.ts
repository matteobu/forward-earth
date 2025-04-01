/**
 * Unit tests for ActivityTypesController
 *
 * This test suite covers the functionality of the ActivityTypesController,
 * focusing on the findAll method. It includes tests for:
 * - Controller instantiation
 * - Successful retrieval of activity types
 * - Handling of empty results
 * - Error propagation from the service
 */
import { Test, TestingModule } from '@nestjs/testing';
import { ActivityTypesController } from './activity-types.controller';
import { ActivityTypesService } from './activity-types.service';

describe('ActivityTypesController', () => {
  let controller: ActivityTypesController;
  let activityTypesServiceMock: Partial<ActivityTypesService>;

  beforeEach(async () => {
    activityTypesServiceMock = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityTypesController],
      providers: [
        {
          provide: ActivityTypesService,
          useValue: activityTypesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ActivityTypesController>(ActivityTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all activity types', async () => {
      const mockActivityTypes = [
        { id: 1, name: 'Type 1' },
        { id: 2, name: 'Type 2' },
      ];

      (activityTypesServiceMock.findAll as jest.Mock).mockResolvedValue(
        mockActivityTypes,
      );

      const result = await controller.findAll();

      expect(activityTypesServiceMock.findAll).toHaveBeenCalled();

      expect(result).toEqual(mockActivityTypes);
    });

    it('should handle empty results', async () => {
      (activityTypesServiceMock.findAll as jest.Mock).mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });

    it('should propagate errors from service', async () => {
      const errorMessage = 'Service error';
      (activityTypesServiceMock.findAll as jest.Mock).mockRejectedValue(
        new Error(errorMessage),
      );
      await expect(controller.findAll()).rejects.toThrow(errorMessage);
    });
  });
});
