import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Dashboard from './components/Dashboard';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthRedirect } from './components/AuthRedirect';
import { URL_ENDPOINTS } from './utils/endpoints';

const App: React.FC = () => {
  return (
    <UserProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path={URL_ENDPOINTS.ROOT} element={<AuthRedirect />} />
            <Route path={URL_ENDPOINTS.LOGIN} element={<AuthRedirect />} />

            <Route
              path={URL_ENDPOINTS.DASHBOARD_NESTED}
              element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route
              path={URL_ENDPOINTS.ANY}
              element={<Navigate to={URL_ENDPOINTS.ROOT} />}
            />
          </Routes>
        </Router>
      </AuthProvider>
    </UserProvider>
  );
};

export default App;
