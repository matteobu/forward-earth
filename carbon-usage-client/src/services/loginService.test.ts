import { loginService } from './loginService';
import fetchMock from 'jest-fetch-mock';
import { NavigateFunction } from 'react-router-dom';

fetchMock.enableMocks();

describe('loginService', () => {
  const mockEmail = 'test@example.com';
  const mockName = 'Test User';

  // Mock functions to simulate React state setters and navigation
  const mockSetIsLoading = jest.fn();
  const mockSetError = jest.fn();
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn() as NavigateFunction;

  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
  });

  it('should successfully login and navigate to dashboard', async () => {
    // Mock a successful login response
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 200 });

    await loginService.fetchLoginAuth(
      mockName,
      mockEmail,
      mockSetIsLoading,
      mockSetError,
      mockLogin,
      mockNavigate
    );

    // Verify fetch was called with correct parameters
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: mockEmail, name: mockName }),
      credentials: 'include',
    });

    // Verify subsequent actions
    expect(mockLogin).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    expect(mockSetError).not.toHaveBeenCalled();
  });

  it('should handle login failure', async () => {
    // Mock a failed login response
    fetchMock.mockResponseOnce('', { status: 401 });

    // Spy on console.error to prevent actual error logging
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await loginService.fetchLoginAuth(
      mockName,
      mockEmail,
      mockSetIsLoading,
      mockSetError,
      mockLogin,
      mockNavigate
    );

    // Verify error handling
    expect(mockSetError).toHaveBeenCalledWith(
      'Login failed. Please check your credentials and try again.'
    );
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it('should handle network errors', async () => {
    // Mock a network error
    fetchMock.mockReject(new Error('Network error'));

    // Spy on console.error to prevent actual error logging
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await loginService.fetchLoginAuth(
      mockName,
      mockEmail,
      mockSetIsLoading,
      mockSetError,
      mockLogin,
      mockNavigate
    );

    // Verify error handling
    expect(mockSetError).toHaveBeenCalledWith(
      'Login failed. Please check your credentials and try again.'
    );
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
