
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
  courseCodes?: string[];
  classesTeaching?: {
    department: string;
    level: string;
    courseCode: string;
  }[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}
