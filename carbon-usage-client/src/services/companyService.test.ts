import { companyService } from './companyService';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('companyService', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe('fetchCompanyData', () => {
    const mockUserId = 123;

    it('should fetch company data successfully', async () => {
      const mockCompanyData = {
        id: mockUserId,
        name: 'Test Company',
        industry: 'Technology',
        employees: 50,
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockCompanyData));

      const result = await companyService.fetchCompanyData(mockUserId);

      expect(fetchMock).toHaveBeenCalledWith(
        `http://localhost:3000/companies/${mockUserId}`,
        {
          credentials: 'include',
        }
      );

      expect(result).toEqual(mockCompanyData);
    });

    it('should handle HTTP errors correctly', async () => {
      fetchMock.mockResponseOnce('Company not found', {
        status: 404,
        statusText: 'Not Found',
      });

      await expect(companyService.fetchCompanyData(mockUserId)).rejects.toThrow(
        /HTTP error! status: 404/
      );
    });

    it('should handle network errors correctly', async () => {
      fetchMock.mockReject(new Error('Network error'));

      await expect(companyService.fetchCompanyData(mockUserId)).rejects.toThrow(
        'Network error'
      );
    });
  });
});
