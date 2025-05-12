
import React from 'react';
import { Check, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNotifications } from '@/context/notification-context';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '@/types/notification';

export const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotifications();

  // Format timestamp to relative time
  const formatTimestamp = (timestamp: number) => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  // Group notifications by date (today, yesterday, older)
  const groupedNotifications = notifications.reduce<{
    today: Notification[];
    yesterday: Notification[];
    older: Notification[];
  }>(
    (groups, notification) => {
      const now = new Date();
      const notificationDate = new Date(notification.timestamp);
      
      // Reset hours to compare just the date
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).getTime();
      const notificationDay = new Date(
        notificationDate.getFullYear(),
        notificationDate.getMonth(),
        notificationDate.getDate()
      ).getTime();
      
      if (notificationDay === today) {
        groups.today.push(notification);
      } else if (notificationDay === yesterday) {
        groups.yesterday.push(notification);
      } else {
        groups.older.push(notification);
      }
      
      return groups;
    },
    { today: [], yesterday: [], older: [] }
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllAsRead}
            disabled={notifications.length === 0}
          >
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearNotifications}
            disabled={notifications.length === 0}
          >
            <Trash className="mr-2 h-4 w-4" />
            Clear all
          </Button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">You have no notifications</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Today's notifications */}
          {groupedNotifications.today.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Today</h3>
              {groupedNotifications.today.map(notification => (
                <NotificationCard 
                  key={notification.id} 
                  notification={notification} 
                  onMarkAsRead={markAsRead} 
                  formatTimestamp={formatTimestamp}
                />
              ))}
            </div>
          )}

          {/* Yesterday's notifications */}
          {groupedNotifications.yesterday.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Yesterday</h3>
              {groupedNotifications.yesterday.map(notification => (
                <NotificationCard 
                  key={notification.id} 
                  notification={notification} 
                  onMarkAsRead={markAsRead} 
                  formatTimestamp={formatTimestamp}
                />
              ))}
            </div>
          )}

          {/* Older notifications */}
          {groupedNotifications.older.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Older</h3>
              {groupedNotifications.older.map(notification => (
                <NotificationCard 
                  key={notification.id} 
                  notification={notification} 
                  onMarkAsRead={markAsRead} 
                  formatTimestamp={formatTimestamp}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  formatTimestamp: (timestamp: number) => string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ 
  notification, 
  onMarkAsRead,
  formatTimestamp 
}) => {
  // Determine notification style based on type and read status
  const getNotificationStyle = () => {
    if (notification.read) {
      return "bg-white";
    }
    
    switch (notification.type) {
      case 'success':
        return "bg-green-50 border-l-4 border-green-500";
      case 'error':
        return "bg-red-50 border-l-4 border-red-500";
      case 'warning':
        return "bg-yellow-50 border-l-4 border-yellow-500";
      default:
        return "bg-blue-50 border-l-4 border-blue-500";
    }
  };

  return (
    <Card className={`${getNotificationStyle()} transition-colors`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="font-medium">{notification.title}</p>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
            <p className="text-xs text-muted-foreground">{formatTimestamp(notification.timestamp)}</p>
          </div>
          {!notification.read && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onMarkAsRead(notification.id)}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
