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

const App: React.FC = () => {
  return (
    <UserProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<AuthRedirect />} />
            <Route path="/login" element={<AuthRedirect />} />

            <Route
              path="/dashboard/*"
              element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </UserProvider>
  );
};

export default App;
