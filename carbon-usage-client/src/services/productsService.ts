import { API_ENDPOINTS } from '../utils/endpoints';

export const productsService = {
  fetchAllProducts: async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PRODUCTS, {
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
