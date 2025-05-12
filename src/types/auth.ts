
export type UserRole = 'lecturer' | 'student';

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  department?: string;
  level?: string;
  courses?: string[];
  profileImage?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}
