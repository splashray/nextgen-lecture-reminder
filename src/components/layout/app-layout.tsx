
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { useAuth } from '@/context/auth-context';

interface AppLayoutProps {
  requiredRole?: 'lecturer' | 'student';
}

export const AppLayout: React.FC<AppLayoutProps> = ({ requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl font-medium">Loading...</div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  // Redirect if wrong role
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'lecturer' ? '/lecturer-dashboard' : '/student-dashboard'} />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
