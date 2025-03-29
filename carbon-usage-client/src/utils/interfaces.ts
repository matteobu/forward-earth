export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}
export interface User {
  id: string;
  email: string;
  name: string;
}
