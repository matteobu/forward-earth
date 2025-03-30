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

// SIDE BAR INTERFACES
export interface SidebarProps {
  className?: string;
}

interface NavItemBase {
  title: string;
  icon: React.ReactNode;
  path?: string;
}

export interface NavItem extends NavItemBase {
  children?: NavItem[];
}

interface DividerItem {
  divider: true;
  heading?: string;
}

export type NavItemOrDivider = NavItem | DividerItem;
