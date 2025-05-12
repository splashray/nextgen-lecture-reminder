
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthState } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  login: (id: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => void;
}

const defaultState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

const AuthContext = createContext<AuthContextType>({
  ...defaultState,
  login: async () => false,
  logout: () => {},
  updateUserProfile: () => {},
});

// Mock users for demonstration
const mockUsers = {
  lecturers: [
    {
      id: 'STAFF001',
      password: 'password123',
      name: 'Dr. John Smith',
      role: 'lecturer' as UserRole,
      department: 'Computer Science',
      courses: ['Web Development', 'Database Systems'],
      profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      id: 'STAFF002',
      password: 'password123',
      name: 'Prof. Sarah Williams',
      role: 'lecturer' as UserRole,
      department: 'Mass Communication',
      courses: ['Media Ethics', 'Digital Journalism'],
      profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
  ],
  students: [
    {
      id: 'STD001',
      password: 'password123',
      name: 'Alice Johnson',
      role: 'student' as UserRole,
      department: 'Computer Science',
      level: 'HND1',
      profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    {
      id: 'STD002',
      password: 'password123',
      name: 'Bob Anderson',
      role: 'student' as UserRole,
      department: 'Mass Communication',
      level: 'ND2',
      profileImage: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
  ],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(defaultState);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved user session in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setState({
          user,
          isAuthenticated: true,
          loading: false,
        });
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
        setState({ ...defaultState, loading: false });
      }
    } else {
      setState({ ...defaultState, loading: false });
    }
  }, []);

  const login = async (id: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check credentials for the correct user type
    const users = role === 'lecturer' ? mockUsers.lecturers : mockUsers.students;
    const user = users.find(u => u.id === id && u.password === password);
    
    if (user) {
      // Remove password from user object before storing
      const { password: _pw, ...secureUser } = user;
      
      // Save to state
      setState({
        user: secureUser,
        isAuthenticated: true,
        loading: false,
      });
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(secureUser));
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${secureUser.name}!`,
      });
      
      return true;
    }
    
    toast({
      title: 'Login failed',
      description: 'Invalid credentials. Please try again.',
      variant: 'destructive',
    });
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setState({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      setState({
        ...state,
        user: updatedUser,
      });
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
