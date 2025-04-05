import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseService } from './supabase.service';

const mockSupabaseClient = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  gte: jest.fn().mockReturnThis(),
  lte: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  range: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
};

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}));

describe('SupabaseService', () => {
  let service: SupabaseService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SupabaseService],
    }).compile();

    service = module.get<SupabaseService>(SupabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserByEmail', () => {
    it('should get a user by email successfully', async () => {
      const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: mockUser,
        error: null,
      });

      const result = await service.getUserByEmail('test@example.com');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('Users');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith(
        'email',
        'test@example.com',
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw an error when fetching fails', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: new Error('DB error'),
      });

      await expect(service.getUserByEmail('test@example.com')).rejects.toThrow(
        'Error fetching user from Supabase',
      );
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const mockUser = { id: 1, name: 'New User', email: 'new@example.com' };
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: mockUser,
        error: null,
      });

      const result = await service.createUser('New User', 'new@example.com');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('Users');
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith([
        { name: 'New User', email: 'new@example.com' },
      ]);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error when creation fails', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: new Error('DB error'),
      });

      await expect(
        service.createUser('New User', 'new@example.com'),
      ).rejects.toThrow('Error creating user in Supabase');
    });
  });

  describe('getAllActivityType', () => {
    it('should get all activity types successfully', async () => {
      const mockActivityTypes = [
        { id: 1, name: 'Driving', emission_factor: 0.2 },
      ];
      mockSupabaseClient.select.mockResolvedValueOnce({
        data: mockActivityTypes,
        error: null,
      });

      const result = await service.getAllActivityType();

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('ActivityTypeTable');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockActivityTypes);
    });

    it('should throw an error when fetching fails', async () => {
      mockSupabaseClient.select.mockResolvedValueOnce({
        data: null,
        error: new Error('DB error'),
      });

      await expect(service.getAllActivityType()).rejects.toThrow(
        'Error fetching consumptions: DB error',
      );
    });
  });

  describe('getAllUnit', () => {
    it('should get all units successfully', async () => {
      const mockUnits = [{ id: 1, name: 'liters' }];
      mockSupabaseClient.select.mockResolvedValueOnce({
        data: mockUnits,
        error: null,
      });

      const result = await service.getAllUnit();

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('UnitTable');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockUnits);
    });

    it('should throw an error when fetching fails', async () => {
      mockSupabaseClient.select.mockResolvedValueOnce({
        data: null,
        error: new Error('DB error'),
      });

      await expect(service.getAllUnit()).rejects.toThrow(
        'Error fetching consumptions: DB error',
      );
    });
  });

  describe('getUserConsumption', () => {
    const mockTransformedData = [
      {
        id: 1,
        user_id: 1,
        amount: 10,
        activity_type_table_id: 1,
        unit_id: 1,
        co2_equivalent: 2.5,
        date: '2023-01-01',
        created_at: '2023-01-01T10:00:00Z',
        deleted_at: null,
        unit_table: { id: 1, name: 'liters' },
        activity_table: { id: 1, name: 'Driving', emission_factor: 0.2 },
      },
    ];

    beforeEach(() => {
      mockSupabaseClient.range.mockResolvedValueOnce({
        data: [
          {
            id: 1,
            user_id: 1,
            amount: 10,
            activity_type_table_id: 1,
            unit_id: 1,
            co2_equivalent: 2.5,
            date: '2023-01-01',
            created_at: '2023-01-01T10:00:00Z',
            deleted_at: null,
            UnitTable: { id: 1, name: 'liters' },
            ActivityTypeTable: { id: 1, name: 'Driving', emission_factor: 0.2 },
          },
        ],
        error: null,
        count: 1,
      });
    });

    it('should get user consumption with pagination', async () => {
      const options = {
        page: 1,
        limit: 10,
        filters: { user_id: 1 },
      };

      const result = await service.getUserConsumption(
        'ConsumptionTable',
        options,
      );

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('ConsumptionTable');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*', {
        count: 'exact',
      });
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('user_id', 1);
      expect(mockSupabaseClient.range).toHaveBeenCalledWith(0, 9);

      expect(result).toEqual({
        data: mockTransformedData,
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });

    it('should apply numeric filters correctly', async () => {
      const options = {
        page: 1,
        limit: 10,
        filters: {
          user_id: 1,
          gte_amount: '5',
          lte_co2_equivalent: '10',
        },
      };

      await service.getUserConsumption('ConsumptionTable', options);

      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('user_id', 1);
      expect(mockSupabaseClient.gte).toHaveBeenCalledWith('amount', 5);
      expect(mockSupabaseClient.lte).toHaveBeenCalledWith('co2_equivalent', 10);
    });

    it('should apply ordering if specified', async () => {
      const options = {
        page: 1,
        limit: 10,
        filters: { user_id: 1 },
        orderBy: 'date',
        ascending: false,
      };

      await service.getUserConsumption('ConsumptionTable', options);

      expect(mockSupabaseClient.order).toHaveBeenCalledWith('date', {
        ascending: false,
      });
    });

    it('should handle extra query function if provided', async () => {
      const extraQueryMock = jest.fn((query: any): any => query);

      const options = {
        page: 1,
        limit: 10,
        filters: { user_id: 1 },
        extraQuery: extraQueryMock,
      };

      await service.getUserConsumption('ConsumptionTable', options);

      expect(extraQueryMock).toHaveBeenCalled();
    });

    it('should throw an error for invalid transformed data', async () => {
      mockSupabaseClient.range.mockReset();
      mockSupabaseClient.range.mockResolvedValueOnce({
        data: [
          {
            id: 'non-numeric',
            user_id: 'also-non-numeric',
            amount: 'not-a-number',
            activity_type_table_id: null,
            unit_id: undefined,
            co2_equivalent: 'invalid',
            date: 12345,
            created_at: null,
            deleted_at: 42,
            UnitTable: null,
            ActivityTypeTable: 'not-an-object',
          },
        ],
        error: null,
        count: 1,
      });

      const options = {
        page: 1,
        limit: 10,
        filters: { user_id: 1 },
      };

      await expect(
        service.getUserConsumption('ConsumptionTable', options),
      ).rejects.toThrow('Transformed data does not match the expected format.');
    });
  });

  describe('createConsumption', () => {
    const mockConsumptionDto = {
      user_id: 1,
      amount: 10,
      activity_type_table_id: 1,
      unit: 'liters',
      co2_equivalent: 2.5,
      date: '2023-01-01',
    };

    it('should create a consumption entry successfully', async () => {
      jest.clearAllMocks();

      const mockEqUnitFn = jest.fn().mockResolvedValueOnce({
        data: [{ id: 2 }],
        error: null,
      });
      mockSupabaseClient.select.mockImplementationOnce(() => ({
        eq: mockEqUnitFn,
      }));

      const mockSingleFn = jest.fn().mockResolvedValueOnce({
        data: { id: 10 },
        error: null,
      });
      const mockLimitFn = jest.fn().mockReturnValue({
        single: mockSingleFn,
      });
      const mockOrderFn = jest.fn().mockReturnValue({
        limit: mockLimitFn,
      });
      mockSupabaseClient.select.mockImplementationOnce(() => ({
        order: mockOrderFn,
      }));

      const mockSelectFn = jest.fn().mockResolvedValueOnce({
        data: [
          {
            id: 11,
            user_id: 1,
            amount: 10,
            activity_type_table_id: 1,
            unit_id: 2,
            co2_equivalent: 2.5,
            date: '2023-01-01',
            created_at: expect.any(String),
          },
        ],
        error: null,
      });
      mockSupabaseClient.insert.mockImplementationOnce(() => ({
        select: mockSelectFn,
      }));

      const result = await service.createConsumption(mockConsumptionDto);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('UnitTable');
      expect(mockEqUnitFn).toHaveBeenCalledWith('name', 'liters');
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('ConsumptionTable');
      expect(mockOrderFn).toHaveBeenCalledWith('id', { ascending: false });
      expect(mockLimitFn).toHaveBeenCalledWith(1);
      expect(result).toBeDefined();
    });

    it('should throw an error when unit fetch fails', async () => {
      jest.clearAllMocks();

      const mockEqUnitFn = jest.fn().mockResolvedValueOnce({
        data: null,
        error: new Error('Unit error'),
      });
      mockSupabaseClient.select.mockImplementationOnce(() => ({
        eq: mockEqUnitFn,
      }));

      await expect(
        service.createConsumption(mockConsumptionDto),
      ).rejects.toThrow('Error creating unit: Unit error');
    });

    it('should throw an error when last record fetch fails', async () => {
      jest.clearAllMocks();

      const mockEqUnitFn = jest.fn().mockResolvedValueOnce({
        data: [{ id: 2 }],
        error: null,
      });
      mockSupabaseClient.select.mockImplementationOnce(() => ({
        eq: mockEqUnitFn,
      }));

      const mockSingleFn = jest.fn().mockResolvedValueOnce({
        data: null,
        error: new Error('Last record error'),
      });
      const mockLimitFn = jest.fn().mockReturnValue({
        single: mockSingleFn,
      });
      const mockOrderFn = jest.fn().mockReturnValue({
        limit: mockLimitFn,
      });
      mockSupabaseClient.select.mockImplementationOnce(() => ({
        order: mockOrderFn,
      }));

      await expect(
        service.createConsumption(mockConsumptionDto),
      ).rejects.toThrow('Error creating unit: Last record error');
    });

    it('should throw an error when insertion fails', async () => {
      jest.clearAllMocks();

      const mockEqUnitFn = jest.fn().mockResolvedValueOnce({
        data: [{ id: 2 }],
        error: null,
      });
      mockSupabaseClient.select.mockImplementationOnce(() => ({
        eq: mockEqUnitFn,
      }));

      const mockSingleFn = jest.fn().mockResolvedValueOnce({
        data: { id: 10 },
        error: null,
      });
      const mockLimitFn = jest.fn().mockReturnValue({
        single: mockSingleFn,
      });
      const mockOrderFn = jest.fn().mockReturnValue({
        limit: mockLimitFn,
      });
      mockSupabaseClient.select.mockImplementationOnce(() => ({
        order: mockOrderFn,
      }));

      const mockSelectFn = jest.fn().mockResolvedValueOnce({
        data: null,
        error: new Error('Insert error'),
      });
      mockSupabaseClient.insert.mockImplementationOnce(() => ({
        select: mockSelectFn,
      }));

      await expect(
        service.createConsumption(mockConsumptionDto),
      ).rejects.toThrow('Error creating consumption: Insert error');
    });
  });

  describe('deleteUserConsumption', () => {
    it('should delete a consumption entry successfully', async () => {
      mockSupabaseClient.delete.mockReturnThis();
      mockSupabaseClient.eq.mockResolvedValueOnce({ error: null });

      const result = await service.deleteUserConsumption(1);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('ConsumptionTable');
      expect(mockSupabaseClient.delete).toHaveBeenCalled();
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', 1);
      expect(result).toEqual({ success: true, id: 1 });
    });

    it('should throw an error when deletion fails', async () => {
      mockSupabaseClient.delete.mockReturnThis();
      mockSupabaseClient.eq.mockResolvedValueOnce({
        error: new Error('Delete error'),
      });

      await expect(service.deleteUserConsumption(1)).rejects.toThrow(
        'Error deleting consumption: Delete error',
      );
    });
  });

  describe('updateUserConsumption', () => {
    const mockUpdateData = {
      amount: 15,
      co2_equivalent: 3.0,
      date: '2023-01-02',
    };

    it('should update consumption fields successfully', async () => {
      jest.clearAllMocks();

      const transformedConsumption = {
        id: 1,
        user_id: 1,
        amount: 15,
        activity_type_table_id: 1,
        unit_id: 1,
        co2_equivalent: 3.0,
        date: '2023-01-02',
        created_at: '2023-01-01T10:00:00Z',
        deleted_at: null,
        unit_table: { id: 1, name: 'liters' },
        activity_table: { id: 1, name: 'Driving', emission_factor: 0.2 },
      };

      jest
        .spyOn(service, 'updateUserConsumption')
        .mockResolvedValueOnce(transformedConsumption);

      const result = await service.updateUserConsumption(1, mockUpdateData);

      expect(result).toHaveProperty('unit_table');
      expect(result).toHaveProperty('activity_table');
      expect(result).not.toHaveProperty('UnitTable');
      expect(result).not.toHaveProperty('ActivityTypeTable');

      jest.spyOn(service, 'updateUserConsumption').mockRestore();
    });

    it('should throw an error when fetching current consumption fails', async () => {
      jest.clearAllMocks();

      const mockSingleFn = jest.fn().mockResolvedValueOnce({
        data: null,
        error: new Error('Fetch error'),
      });
      const mockEqFn = jest.fn().mockReturnValue({
        single: mockSingleFn,
      });
      mockSupabaseClient.select.mockImplementationOnce(() => ({
        eq: mockEqFn,
      }));

      await expect(
        service.updateUserConsumption(1, mockUpdateData),
      ).rejects.toThrow('Error fetching current consumption: Fetch error');
    });
  });

  describe('getCompanyData', () => {
    it('should get company data successfully', async () => {
      jest.clearAllMocks();

      const mockCompanyData = [{ id: 1, name: 'Test Company', user_id: 1 }];

      const mockEqFn = jest.fn().mockResolvedValueOnce({
        data: mockCompanyData,
        error: null,
      });

      mockSupabaseClient.select.mockImplementationOnce(() => ({
        eq: mockEqFn,
      }));

      const result = await service.getCompanyData(1);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('CompanyTable');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
      expect(mockEqFn).toHaveBeenCalledWith('user_id', 1);
      expect(result).toEqual(mockCompanyData);
    });
  });

  describe('getProductsData', () => {
    it('should get products data successfully', async () => {
      const mockProductsData = [{ id: 1, name: 'Test Product' }];
      mockSupabaseClient.select.mockResolvedValueOnce({
        data: mockProductsData,
        error: null,
      });

      const result = await service.getProductsData();

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('ProductTable');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockProductsData);
    });

    it('should throw an error when fetching fails', async () => {
      mockSupabaseClient.select.mockResolvedValueOnce({
        data: null,
        error: new Error('Products error'),
      });

      await expect(service.getProductsData()).rejects.toThrow(
        'Error deleting consumption: Products error',
      );
    });
  });
});
