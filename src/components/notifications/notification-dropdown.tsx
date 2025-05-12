
import React from 'react';
import { Bell, Check } from 'lucide-react';
import { 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuShortcut 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/context/notification-context';
import { formatDistanceToNow } from 'date-fns';

export const NotificationDropdown: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  // Format timestamp to relative time
  const formatTimestamp = (timestamp: number) => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  return (
    <DropdownMenuContent className="w-80" align="end">
      <DropdownMenuLabel className="flex items-center justify-between">
        <span>Notifications</span>
        {notifications.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={markAllAsRead}
            className="h-8 px-2 text-xs"
          >
            <Check className="mr-1 h-4 w-4" />
            Mark all read
          </Button>
        )}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      
      {notifications.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          <Bell className="mx-auto mb-2 h-6 w-6 opacity-50" />
          <p>No notifications yet</p>
          <p className="text-xs">We'll notify you when something important happens</p>
        </div>
      ) : (
        <>
          {notifications.slice(0, 5).map((notification) => (
            <DropdownMenuItem 
              key={notification.id}
              className="cursor-pointer"
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex w-full flex-col">
                <div className="flex items-start justify-between">
                  <p className={`font-medium ${notification.read ? '' : 'text-blue-600'}`}>
                    {notification.title}
                  </p>
                  <DropdownMenuShortcut className="text-xs text-muted-foreground">
                    {formatTimestamp(notification.timestamp)}
                  </DropdownMenuShortcut>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
              </div>
            </DropdownMenuItem>
          ))}
        </>
      )}
    </DropdownMenuContent>
  );
};
