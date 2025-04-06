import { API_ENDPOINTS, URL_ENDPOINTS } from '../utils/endpoints';
import { NavigateFunction } from 'react-router-dom';

export const authService = {
  authUser: async () => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH_USER, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Not authenticated');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('authUser error:', error);
      throw error;
    }
  },

  fetchLoginAuth: async (
    name: string,
    email: string,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
    login: () => Promise<void>,
    navigate: NavigateFunction
  ) => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      login();
      navigate(URL_ENDPOINTS.DASHBOARD);
    } catch (error) {
      console.error('Login failed', error);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  },

  logout: async () => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH_LOGOUT, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed on server');
      }

      console.log('Logout successful');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  },
};
