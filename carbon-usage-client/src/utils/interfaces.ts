export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}
export interface User {
  userId: number;
  email: string;
  name: string;
}

export interface FormData {
  amount: string;
  activityTypeId: string;
  unitId: string;
  date: string;
}

export interface ChangeEvent {
  target: {
    name: keyof FormData;
    value: string;
  };
}
