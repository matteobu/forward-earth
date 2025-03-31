import { User } from '@/utils/interfaces';
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface UserContextType {
  userContext: User;
  setUserContext: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userContext, setUserContext] = useState<User>({
    userId: 0,
    name: '',
    email: '',
  });

  return (
    <UserContext.Provider value={{ userContext, setUserContext }}>
      {children}
    </UserContext.Provider>
  );
};
