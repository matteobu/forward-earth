const API_BASE_URL = 'http://localhost:3000';

export const productionService = {
  fetchAllProductionBatches: async () => {
    const url = `${API_BASE_URL}/production/`;

    try {
      const response = await fetch(url, {
        credentials: 'include',
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorBody}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },
};
