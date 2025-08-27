'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, User, FileText, LayoutGrid, Eye } from 'lucide-react';

interface Activity {
  id: string;
  type: 'blog' | 'project' | 'user';
  title: string;
  description: string;
  timestamp: string;
  author?: string;
  views?: number;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const response = await fetch('/api/dashboard/recent-activity');
        const result = await response.json();
        if (result.success) {
          setActivities(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch recent activity:', error);
        // Mock data for demonstration
        setActivities([
          {
            id: '1',
            type: 'blog',
            title: 'Getting Started with Next.js 14',
            description: 'A comprehensive guide to building modern web applications',
            timestamp: '2 hours ago',
            author: 'John Doe',
            views: 156
          },
          {
            id: '2',
            type: 'project',
            title: 'E-commerce Platform',
            description: 'Full-stack e-commerce solution with React and Node.js',
            timestamp: '4 hours ago',
            author: 'Jane Smith',
            views: 89
          },
          {
            id: '3',
            type: 'user',
            title: 'New User Registration',
            description: 'Sarah Wilson joined the platform',
            timestamp: '6 hours ago'
          },
          {
            id: '4',
            type: 'blog',
            title: 'Advanced TypeScript Patterns',
            description: 'Learn advanced TypeScript techniques for better code',
            timestamp: '1 day ago',
            author: 'Mike Johnson',
            views: 234
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'blog':
        return <FileText className="w-4 h-4" />;
      case 'project':
        return <LayoutGrid className="w-4 h-4" />;
      case 'user':
        return <User className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'blog':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'project':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'user':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-cardDark p-4 sm:p-6 rounded-2xl shadow-sm dark:shadow-gray-800/50">
        <h2 className="text-lg sm:text-xl font-semibold text-primaryText dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="flex items-start gap-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-cardDark p-4 sm:p-6 rounded-2xl shadow-sm dark:shadow-gray-800/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-primaryText dark:text-white">
          Recent Activity
        </h2>
        <button className="text-sm text-primary dark:text-blue-400 hover:underline">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {activity.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                  {activity.views && (
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{activity.views}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{activity.timestamp}</span>
                  </div>
                </div>
              </div>
              
              {activity.author && (
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <User className="w-3 h-3" />
                  <span>{activity.author}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
