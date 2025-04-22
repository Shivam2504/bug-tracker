export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Bug {
  _id: string;
  serialNo: number;
  title: string;
  description: string;
  status: string;
  priority: number;
  steps?: string;
  screenshot?: string;
  createdBy?: User;
  assignedTo?: User;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}