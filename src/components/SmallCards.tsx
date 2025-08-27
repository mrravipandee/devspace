'use client';

import { ArrowUpLeftSquare, CalendarDays, Users, FileText, LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardStats {
  visitors: {
    total: number;
    weekly: Array<{ day: string; visitors: number }>;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    planned: number;
  };
  blogs: {
    total: number;
    recent: number;
    weekly: Array<{ day: string; blogs: number }>;
  };
  engagement: {
    percentage: number;
    trend: string;
  };
}

export default function SmallCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-cardDark rounded-xl p-4 animate-pulse"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex items-start gap-3">
                <div className="rounded-lg h-10 w-10 bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const menuItems = [
    {
      title: "Visitors",
      description: stats ? stats.visitors.total.toLocaleString() : "0",
      icon: Users,
      showDate: false,
      trend: stats?.visitors.weekly ? 
        ((stats.visitors.weekly[stats.visitors.weekly.length - 1]?.visitors || 0) - (stats.visitors.weekly[0]?.visitors || 0)) / (stats.visitors.weekly[0]?.visitors || 1) * 100 : 0
    },
    {
      title: "Projects",
      description: stats ? `${stats.projects.active} Active` : "0 Active",
      icon: LayoutGrid,
      showDate: true,
      subtitle: stats ? `${stats.projects.total} Total` : ""
    },
    {
      title: "Blog and Articles",
      description: stats ? `${stats.blogs.total} Published` : "0 Published",
      icon: FileText,
      showDate: true,
      subtitle: stats ? `${stats.blogs.recent} This Week` : ""
    },
    {
      title: "Engagement",
      description: stats ? `${stats.engagement.percentage}%` : "0%",
      icon: ArrowUpLeftSquare,
      showDate: false,
      trend: stats?.engagement.trend === "increase" ? "increase" : "decrease"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {menuItems.map(({ title, description, icon: Icon, showDate, subtitle, trend }, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-cardDark rounded-xl p-4 cursor-pointer flex flex-col h-full group transition-colors duration-200 hover:shadow-md dark:hover:shadow-gray-800/50"
        >
          <div className="flex justify-between items-start gap-3">
            <div className="flex items-start gap-3">
              <div className={`rounded-lg h-10 w-10 flex-shrink-0 flex items-center justify-center ${getIconBgColor(title)} dark:bg-opacity-20 group-hover:opacity-90 transition-opacity`}>
                <Icon className={`${getIconColor(title)} dark:text-opacity-80 h-5 w-5`} />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider mb-1">
                  {title}
                </h3>
                <p className="text-base font-semibold text-gray-800 dark:text-gray-100 leading-tight">
                  {description}
                </p>
                {subtitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {subtitle}
                  </p>
                )}
                {trend !== undefined && (
                  <div className={`flex items-center text-xs mt-1 ${trend === "increase" ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                    <ArrowUpLeftSquare className={`w-3 h-3 mr-1 ${trend === "increase" ? '' : 'rotate-180'}`} />
                    {Math.abs(trend).toFixed(1)}% {trend === "increase" ? 'increase' : 'decrease'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {showDate && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-full inline-flex items-center">
                <CalendarDays className="h-3 w-3 mr-1.5" />
                {new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Helper functions for dynamic styling
function getIconBgColor(title: string) {
    const colors: Record<string, string> = {
        'Visitors': 'bg-[#F4F7FE]',
        'Projects': 'bg-[#F4F7FE]',
        'Blog and Articles': 'bg-[#F4F7FE]',
        'Engagement': 'bg-[#F4F7FE]'
    };
    return colors[title] || 'bg-[#F4F7FE]';
}

function getIconColor(title: string) {
    const colors: Record<string, string> = {
        'Visitors': 'text-primary dark:text-white',
        'Projects': 'text-primary dark:text-white',
        'Blog and Articles': 'text-primary dark:text-white',
        'Engagement': 'text-primary dark:text-white'
    };
    return colors[title] || 'text-primary dark:text-white';
}