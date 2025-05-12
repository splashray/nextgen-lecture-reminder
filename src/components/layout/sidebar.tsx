
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Calendar, 
  Home, 
  User, 
  BookOpen, 
  Clock, 
  Settings,
  Users,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  
  const isLecturer = user?.role === 'lecturer';
  
  const navItems = isLecturer
    ? [
        { icon: Home, label: 'Dashboard', to: '/lecturer-dashboard' },
        { icon: BookOpen, label: 'Courses', to: '/lecturer-courses' },
        { icon: Calendar, label: 'Timetable', to: '/lecturer-timetable' },
        { icon: Users, label: 'Classes', to: '/lecturer-classes' },
        { icon: User, label: 'Profile', to: '/lecturer-profile' },
        { icon: Settings, label: 'Settings', to: '/settings' },
      ]
    : [
        { icon: Home, label: 'Dashboard', to: '/student-dashboard' },
        { icon: CalendarIcon, label: 'Timetable', to: '/student-timetable' },
        { icon: Clock, label: 'Schedule', to: '/student-schedule' },
        { icon: User, label: 'Profile', to: '/student-profile' },
        { icon: Settings, label: 'Settings', to: '/settings' },
      ];

  return (
    <aside className="w-64 border-r bg-white shadow-sm hidden md:block">
      <div className="flex h-16 items-center justify-center border-b">
        <h1 className="text-xl font-bold text-blue-600">NextGen Reminder</h1>
      </div>
      <nav className="space-y-1 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) => cn(
              'flex items-center space-x-3 rounded-lg px-3 py-2 transition-all',
              isActive
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-blue-50'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
