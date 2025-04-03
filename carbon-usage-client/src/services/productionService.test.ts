/**
 * Production Service Tests
 *
 * This test suite covers the productionService functionality, which is responsible for
 * fetching production batch data from the API. The tests verify both successful data
 * retrieval and proper error handling in various scenarios including:
 * - Successful API responses with valid data
 * - HTTP error responses from the server
 * - Network failures and connection issues
 * - Invalid response formats
 * - Empty but valid response handling
 *
 * Each test case mocks the fetch API to simulate different server responses and
 * validates that the service behaves as expected, either by returning the correct
 * data or throwing appropriate exceptions with meaningful error messages.
 */

import { productionService } from './productionService';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('Production Service', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should fetch all production batches successfully', async () => {
    const mockData = [
      {
        id: 1,
        product_id: 'RS001',
        batch_number: 'BATCH-2024-001',
        production_date: '2024-01-15',
        total_units: 1250,
        production_efficiency: 0.92,
      },
      {
        id: 2,
        product_id: 'SG001',
        batch_number: 'BATCH-2024-002',
        production_date: '2024-01-16',
        total_units: 1400,
        production_efficiency: 0.93,
      },
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await productionService.fetchAllProductionBatches();

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/production/',
      {
        credentials: 'include',
      }
    );

    expect(result).toEqual(mockData);
  });

  it('should handle HTTP error responses', async () => {
    fetchMock.mockResponseOnce('Internal Server Error', {
      status: 500,
    });

    await expect(productionService.fetchAllProductionBatches()).rejects.toThrow(
      'HTTP error! status: 500, message: Internal Server Error'
    );
  });

  it('should handle network errors', async () => {
    fetchMock.mockReject(new Error('Network failure'));

    await expect(productionService.fetchAllProductionBatches()).rejects.toThrow(
      'Network failure'
    );
  });

  it('should handle unexpected server responses', async () => {
    fetchMock.mockResponseOnce('Not JSON data', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });

    await expect(
      productionService.fetchAllProductionBatches()
    ).rejects.toThrow();
  });

  it('should handle empty responses', async () => {
    fetchMock.mockResponseOnce('[]', {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await productionService.fetchAllProductionBatches();
    expect(result).toEqual([]);
  });
});
