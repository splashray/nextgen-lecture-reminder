
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Redirect based on user role
  if (user?.role === 'lecturer') {
    return <Navigate to="/lecturer-dashboard" />;
  }

  return <Navigate to="/student-dashboard" />;
};

export default Index;
