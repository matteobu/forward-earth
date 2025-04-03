import { consumptionService } from './consumptionService';
import fetchMock from 'jest-fetch-mock';
import { NavigateFunction } from 'react-router-dom';

fetchMock.enableMocks();

describe('consumptionService', () => {
  const mockUserId = 123;

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe('fetchConsumptions', () => {
    it('should fetch consumptions with default parameters', async () => {
      const mockConsumptionData = {
        data: [
          { id: 1, amount: 100, activity_type_table_id: 1, co2_equivalent: 50 },
          {
            id: 2,
            amount: 200,
            activity_type_table_id: 2,
            co2_equivalent: 100,
          },
        ],
        meta: { total: 2, totalPages: 1 },
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockConsumptionData));

      const result = await consumptionService.fetchConsumptions({
        userId: mockUserId,
      });

      expect(fetchMock).toHaveBeenCalledWith(
        `http://localhost:3000/consumption/${mockUserId}`,
        { credentials: 'include' }
      );

      expect(result).toEqual(mockConsumptionData);
    });

    it('should fetch consumptions with all parameters', async () => {
      const mockConsumptionData = {
        data: [
          { id: 1, amount: 100, activity_type_table_id: 1, co2_equivalent: 50 },
        ],
        meta: { total: 1, totalPages: 1 },
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockConsumptionData));

      const params = {
        userId: mockUserId,
        page: 1,
        limit: 10,
        sortBy: 'date',
        sortOrder: 'desc' as const,
        dateFrom: '2023-01-01',
        dateTo: '2023-12-31',
        activityType: 1,
        amountMin: 50,
        amountMax: 200,
        co2Min: 20,
        co2Max: 100,
      };

      const result = await consumptionService.fetchConsumptions(params);

      const expectedUrl = `http://localhost:3000/consumption/${mockUserId}?page=1&limit=10&sortBy=date&sortOrder=DESC&dateFrom=2023-01-01&dateTo=2023-12-31&amountMin=50&amountMax=200&co2Min=20&co2Max=100&activityType=1`;

      expect(fetchMock).toHaveBeenCalledWith(expectedUrl, {
        credentials: 'include',
      });

      expect(result).toEqual(mockConsumptionData);
    });

    it('should return empty data for empty response', async () => {
      fetchMock.mockResponseOnce('');

      const result = await consumptionService.fetchConsumptions({
        userId: mockUserId,
      });

      expect(result).toEqual({ data: [], meta: { total: 0, totalPages: 1 } });
    });

    it('should handle HTTP errors', async () => {
      fetchMock.mockResponseOnce('', { status: 500 });

      await expect(
        consumptionService.fetchConsumptions({ userId: mockUserId })
      ).rejects.toThrow('Error: 500');
    });
  });

  describe('updateConsumption', () => {
    it('should update a consumption record', async () => {
      const mockUpdateData = { amount: 150 };
      const mockResponseData = { id: 1, ...mockUpdateData };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponseData));

      const result = await consumptionService.updateConsumption(
        1,
        mockUpdateData
      );

      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:3000/consumption/patch/1',
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockUpdateData),
          credentials: 'include',
        }
      );

      expect(result).toEqual(mockResponseData);
    });

    it('should handle update errors', async () => {
      fetchMock.mockResponseOnce('', { status: 400 });

      await expect(
        consumptionService.updateConsumption(1, { amount: 150 })
      ).rejects.toThrow('Error: 400');
    });
  });

  describe('deleteConsumption', () => {
    it('should delete a consumption record', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}));

      const result = await consumptionService.deleteConsumption(1);

      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:3000/consumption/delete/1',
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      expect(result).toBe(true);
    });

    it('should handle delete errors', async () => {
      fetchMock.mockResponseOnce('', { status: 404 });

      await expect(consumptionService.deleteConsumption(1)).rejects.toThrow(
        'Error: 404'
      );
    });
  });

  describe('createConsumption', () => {
    const mockNavigate = jest.fn() as NavigateFunction;
    const mockSetIsSubmitting = jest.fn();

    const mockConsumptionData = {
      user_id: mockUserId,
      amount: 100,
      activity_type_table_id: 1,
      date: '2023-01-01',
      co2_equivalent: 50,
      unit_id: 1,
      unit_table: { id: 1, name: 'kWh' },
    };

    it('should create a consumption record and navigate', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}));

      await consumptionService.createConsumption(
        mockConsumptionData,
        mockNavigate,
        mockSetIsSubmitting
      );

      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:3000/consumption/create',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockConsumptionData),
          credentials: 'include',
        }
      );

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/consumptions/list');
    });

    it('should handle create errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      fetchMock.mockResponseOnce('', { status: 500 });

      await consumptionService.createConsumption(
        mockConsumptionData,
        mockNavigate,
        mockSetIsSubmitting
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to create consumption',
        expect.any(Error)
      );
      expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);

      consoleErrorSpy.mockRestore();
    });
  });
});
