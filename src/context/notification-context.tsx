
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '@/types/notification';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './auth-context';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearNotifications: () => {},
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Calculate unread count whenever notifications change
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (savedNotifications) {
        try {
          setNotifications(JSON.parse(savedNotifications));
        } catch (error) {
          console.error('Error parsing saved notifications:', error);
        }
      }
    }
  }, [user]);

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  // Set up real-time checking for new notifications 
  useEffect(() => {
    const checkForNewNotifications = () => {
      // In a real app, this would connect to a server or WebSocket
      // For our demo, we'll just check localStorage for changes
      if (user) {
        const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
        if (savedNotifications) {
          try {
            const parsed = JSON.parse(savedNotifications);
            setNotifications(current => {
              // Only update if there are different notifications
              if (JSON.stringify(parsed) !== JSON.stringify(current)) {
                return parsed;
              }
              return current;
            });
          } catch (error) {
            console.error('Error parsing saved notifications:', error);
          }
        }
      }
    };

    // Check more frequently for demo purposes (every 5 seconds)
    const interval = setInterval(checkForNewNotifications, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const addNotification = (
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === 'error' ? 'destructive' : 'default',
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
