import { NavigateFunction } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000';

export const loginService = {
  fetchLoginAuth: async (
    name: string,
    email: string,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
    login: () => Promise<void>,
    navigate: NavigateFunction
  ) => {
    const url = `${API_BASE_URL}/auth/login`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      login();
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  },
};
