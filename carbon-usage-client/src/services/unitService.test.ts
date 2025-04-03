import { unitService } from './unitService';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('unitService', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe('fetchAllUnit', () => {
    it('should fetch all units successfully', async () => {
      const mockUnitsData = [
        { id: 1, name: 'Kilowatt-hour', symbol: 'kWh' },
        { id: 2, name: 'Cubic Meter', symbol: 'm³' },
      ];

      fetchMock.mockResponseOnce(JSON.stringify(mockUnitsData));

      const result = await unitService.fetchAllUnit();

      expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/units/', {
        credentials: 'include',
      });

      expect(result).toEqual(mockUnitsData);
    });

    it('should handle HTTP errors correctly', async () => {
      const errorMessage = 'Units not found';
      fetchMock.mockResponseOnce(errorMessage, {
        status: 404,
        statusText: 'Not Found',
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(unitService.fetchAllUnit()).rejects.toThrow(
        /HTTP error! status: 404, message: Units not found/
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle network errors correctly', async () => {
      const networkError = new Error('Network error');
      fetchMock.mockReject(networkError);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(unitService.fetchAllUnit()).rejects.toThrow('Network error');

      consoleErrorSpy.mockRestore();
    });
  });
});
