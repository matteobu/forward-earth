import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import { URL_ENDPOINTS } from '@/utils/endpoints';

export const AuthRedirect = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? (
    <Navigate to={URL_ENDPOINTS.DASHBOARD} />
  ) : (
    <LoginForm />
  );
};
