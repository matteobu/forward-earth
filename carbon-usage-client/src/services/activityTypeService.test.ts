import { activityTypeService } from './activityTypeService';
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

describe('activityTypeService', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe('fetchAllActivityType', () => {
    it('should fetch activity types successfully', async () => {
      const mockData = [
        { id: 1, name: 'Electricity Consumption', emission_factor: 0.4 },
        { id: 2, name: 'Natural Gas Usage', emission_factor: 2.3 },
      ];

      fetchMock.mockResponseOnce(JSON.stringify(mockData));

      const result = await activityTypeService.fetchAllActivityType();

      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:3000/activity-types/',
        {
          credentials: 'include',
        }
      );

      expect(result).toEqual(mockData);
    });

    it('should handle HTTP errors correctly', async () => {
      fetchMock.mockResponseOnce('Server error', {
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(activityTypeService.fetchAllActivityType()).rejects.toThrow(
        /HTTP error! status: 500, message: Server error/
      );
    });

    it('should handle network errors correctly', async () => {
      fetchMock.mockReject(new Error('Network error'));

      await expect(activityTypeService.fetchAllActivityType()).rejects.toThrow(
        'Network error'
      );
    });
  });
});
