import { loginService } from './loginService';
import fetchMock from 'jest-fetch-mock';
import { NavigateFunction } from 'react-router-dom';

fetchMock.enableMocks();

describe('loginService', () => {
  const mockEmail = 'test@example.com';
  const mockName = 'Test User';

  const mockSetIsLoading = jest.fn();
  const mockSetError = jest.fn();
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn() as NavigateFunction;

  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
  });

  it('should successfully login and navigate to dashboard', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 200 });

    await loginService.fetchLoginAuth(
      mockName,
      mockEmail,
      mockSetIsLoading,
      mockSetError,
      mockLogin,
      mockNavigate
    );

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: mockEmail, name: mockName }),
      credentials: 'include',
    });

    expect(mockLogin).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    expect(mockSetError).not.toHaveBeenCalled();
  });

  it('should handle login failure', async () => {
    fetchMock.mockResponseOnce('', { status: 401 });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await loginService.fetchLoginAuth(
      mockName,
      mockEmail,
      mockSetIsLoading,
      mockSetError,
      mockLogin,
      mockNavigate
    );

    expect(mockSetError).toHaveBeenCalledWith(
      'Login failed. Please check your credentials and try again.'
    );
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);

    consoleErrorSpy.mockRestore();
  });

  it('should handle network errors', async () => {
    fetchMock.mockReject(new Error('Network error'));

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await loginService.fetchLoginAuth(
      mockName,
      mockEmail,
      mockSetIsLoading,
      mockSetError,
      mockLogin,
      mockNavigate
    );

    expect(mockSetError).toHaveBeenCalledWith(
      'Login failed. Please check your credentials and try again.'
    );
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);

    consoleErrorSpy.mockRestore();
  });
});
