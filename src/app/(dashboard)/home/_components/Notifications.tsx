'use client';

import { useState } from 'react';
import { Bell, X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'New Blog Published',
      message: 'Your blog post "Getting Started with Next.js 14" has been published successfully.',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: '2',
      type: 'info',
      title: 'System Update',
      message: 'Dashboard analytics have been updated with new features and improved performance.',
      timestamp: '4 hours ago',
      read: false
    },
    {
      id: '3',
      type: 'warning',
      title: 'Storage Warning',
      message: 'You are approaching your storage limit. Consider cleaning up unused files.',
      timestamp: '1 day ago',
      read: true
    },
    {
      id: '4',
      type: 'error',
      title: 'API Rate Limit',
      message: 'You have reached 80% of your API rate limit for this month.',
      timestamp: '2 days ago',
      read: true
    }
  ]);

  const [showAll, setShowAll] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayNotifications = showAll ? notifications : notifications.slice(0, 3);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="bg-white dark:bg-cardDark rounded-2xl p-6 shadow-sm dark:shadow-gray-800/50">
        <div className="text-center py-8">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Notifications
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            You&apos;re all caught up! Check back later for updates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-cardDark rounded-2xl shadow-sm dark:shadow-gray-800/50">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <button 
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-primary dark:text-blue-400 hover:underline"
        >
          {showAll ? 'Show Less' : 'Show All'}
        </button>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {displayNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${getBgColor(notification.type)} ${
                !notification.read ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {getIcon(notification.type)}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {notification.timestamp}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {notifications.length > 3 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setNotifications([])}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear all notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
