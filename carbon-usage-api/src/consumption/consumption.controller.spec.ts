import { Test, TestingModule } from '@nestjs/testing';
import { ConsumptionController } from './consumption.controller';
import { ConsumptionService } from './consumption.service';
import { HttpException } from '@nestjs/common';
import { CreateConsumptionDto } from './dto/create-consumption.dto';

describe('ConsumptionController', () => {
  let controller: ConsumptionController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: ConsumptionService;

  const mockConsumptionService = {
    getUserConsumption: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
    patch: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsumptionController],
      providers: [
        {
          provide: ConsumptionService,
          useValue: mockConsumptionService,
        },
      ],
    }).compile();

    controller = module.get<ConsumptionController>(ConsumptionController);
    service = module.get<ConsumptionService>(ConsumptionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getConsumptionInfo', () => {
    it('should call getUserConsumption with correct parameters', async () => {
      const user_id = 1;
      const mockResponse = { items: [], total: 0 };
      mockConsumptionService.getUserConsumption.mockResolvedValue(mockResponse);

      const result = await controller.getConsumptionInfo(
        user_id,
        2,
        20,
        'date',
        'DESC',
        '2023-01-01',
        '2023-12-31',
        '100',
        '500',
        10,
        50,
        1,
      );

      expect(mockConsumptionService.getUserConsumption).toHaveBeenCalledWith({
        user_id: 1,
        page: 2,
        limit: 20,
        sortBy: 'date',
        sortOrder: 'DESC',
        dateFrom: '2023-01-01',
        dateTo: '2023-12-31',
        amountMin: 100,
        amountMax: 500,
        co2Min: 10,
        co2Max: 50,
        activityType: 1,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should use default values when optional parameters are not provided', async () => {
      const user_id = 1;
      const mockResponse = { items: [], total: 0 };
      mockConsumptionService.getUserConsumption.mockResolvedValue(mockResponse);

      await controller.getConsumptionInfo(user_id);

      expect(mockConsumptionService.getUserConsumption).toHaveBeenCalledWith({
        user_id: 1,
        page: 1,
        limit: 10,
        sortBy: 'date',
        sortOrder: 'ASC',
        dateFrom: undefined,
        dateTo: undefined,
        amountMin: undefined,
        amountMax: undefined,
        co2Min: undefined,
        co2Max: undefined,
        activityType: undefined,
      });
    });
  });

  describe('create', () => {
    it('should successfully create a consumption entry', async () => {
      const dto: CreateConsumptionDto = {
        user_id: 1,
        activity_type_table_id: 1,
        amount: 100,
        date: '2024-31-12',
        co2_equivalent: 9,
        unit_id: 1,
      };
      const mockCreatedConsumption = { id: 1, ...dto };
      mockConsumptionService.create.mockResolvedValue(mockCreatedConsumption);

      const result = await controller.create(dto);

      expect(mockConsumptionService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        message: 'Consumption added successfully',
        data: mockCreatedConsumption,
      });
    });

    it('should throw an exception when creation fails', async () => {
      const dto: CreateConsumptionDto = {
        user_id: 1,
        activity_type_table_id: 1,
        amount: 100,
        date: '2024-31-12',
        co2_equivalent: 9,
        unit_id: 1,
      };
      const error = new Error('Database error');
      mockConsumptionService.create.mockRejectedValue(error);

      await expect(controller.create(dto)).rejects.toThrow(HttpException);
      expect(mockConsumptionService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('remove', () => {
    it('should successfully delete a consumption entry', async () => {
      const id = '1';
      const mockDeletedConsumption = { id: 1 };
      mockConsumptionService.remove.mockResolvedValue(mockDeletedConsumption);

      const result = await controller.remove(id);

      expect(mockConsumptionService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        message: 'Consumption deleted successfully',
        data: mockDeletedConsumption,
      });
    });

    it('should throw an exception when deletion fails', async () => {
      const id = '1';
      const error = new Error('Database error');
      mockConsumptionService.remove.mockRejectedValue(error);

      await expect(controller.remove(id)).rejects.toThrow(HttpException);
      expect(mockConsumptionService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('patch', () => {
    it('should successfully update a consumption entry', async () => {
      const id = '1';
      const patchDto = { amount: 200 };
      const mockUpdatedConsumption = { id: 1, amount: 200 };
      mockConsumptionService.patch.mockResolvedValue(mockUpdatedConsumption);

      const result = await controller.patch(id, patchDto);

      expect(mockConsumptionService.patch).toHaveBeenCalledWith(1, patchDto);
      expect(result).toEqual({
        message: 'Consumption edited successfully',
        data: mockUpdatedConsumption,
      });
    });

    it('should throw an exception when update fails', async () => {
      const id = '1';
      const patchDto = { amount: 200 };
      const error = new Error('Database error');
      mockConsumptionService.patch.mockRejectedValue(error);

      await expect(controller.patch(id, patchDto)).rejects.toThrow(
        HttpException,
      );
      expect(mockConsumptionService.patch).toHaveBeenCalledWith(1, patchDto);
    });
  });
});
