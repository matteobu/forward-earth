import { productsService } from './productsService';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('productsService', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe('fetchAllProducts', () => {
    it('should fetch all products successfully', async () => {
      const mockProductsData = [
        { id: 1, name: 'Product 1', price: 10 },
        { id: 2, name: 'Product 2', price: 20 },
      ];

      fetchMock.mockResponseOnce(JSON.stringify(mockProductsData));

      const result = await productsService.fetchAllProducts();

      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:3000/products/',
        {
          credentials: 'include',
        }
      );

      expect(result).toEqual(mockProductsData);
    });

    it('should handle HTTP errors correctly', async () => {
      const errorMessage = 'Products not found';
      fetchMock.mockResponseOnce(errorMessage, {
        status: 404,
        statusText: 'Not Found',
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(productsService.fetchAllProducts()).rejects.toThrow(
        /HTTP error! status: 404, message: Products not found/
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle network errors correctly', async () => {
      const networkError = new Error('Network error');
      fetchMock.mockReject(networkError);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(productsService.fetchAllProducts()).rejects.toThrow(
        'Network error'
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
