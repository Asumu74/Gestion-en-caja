export interface Transaction {
  id: string;
  date: string; // ISO date YYYY-MM-DD
  serviceType: string;
  quantity: number;
  amount: number; // Unit price
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
}

export interface Service {
  id: string;
  name: string;
  price: number;
}

export interface User {
  id: string;
  name: string;
  username?: string;
  password?: string;
  role: string;
  avatar?: string;
  avatarUrl?: string;
  avatarType?: 'initial' | 'image';
  theme?: 'light' | 'dark' | 'indigo' | 'emerald' | 'rose';
  email?: string;
  phone?: string;
}

export interface DailyRecord {
  id: string;
  date: string;
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  closedBy: string;
  closedAt: string;
}
