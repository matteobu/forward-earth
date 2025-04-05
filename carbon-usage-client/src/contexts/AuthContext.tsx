import { AuthContextType, User } from '@/interfaces/interfaces';
import { useUser } from './UserContext';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/services/authService';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setUserContext } = useUser();

  const checkAuthStatus = async () => {
    try {
      setLoading(true);

      const user = await authService.authUser();

      setUser(user);
      setUserContext(user);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      console.error('Authentication check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async () => {
    await checkAuthStatus();
  };

  const logout = async () => {
    try {
      await authService.logout();

      // Additional client-side actions after logout
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/login';
    } catch (error) {
      // Optional: Handle any additional errors or UI feedback
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
