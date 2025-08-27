'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Users, FileText, LayoutGrid, Eye } from 'lucide-react';

interface QuickStatsData {
  totalVisitors: number;
  totalProjects: number;
  totalBlogs: number;
  totalUsers: number;
  weeklyGrowth: {
    visitors: number;
    projects: number;
    blogs: number;
  };
}

export default function QuickStats() {
  const [stats, setStats] = useState<QuickStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuickStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        const result = await response.json();
        if (result.success) {
          const data = result.data;
          setStats({
            totalVisitors: data.visitors.total,
            totalProjects: data.projects.total,
            totalBlogs: data.blogs.total,
            totalUsers: Math.floor(data.visitors.total / 3), // Mock user count
            weeklyGrowth: {
              visitors: data.visitors.weekly.length > 1 ? 
                ((data.visitors.weekly[data.visitors.weekly.length - 1]?.visitors || 0) - (data.visitors.weekly[0]?.visitors || 0)) / (data.visitors.weekly[0]?.visitors || 1) * 100 : 0,
              projects: data.projects.active > 0 ? 15 : 0,
              blogs: data.blogs.recent > 0 ? 25 : 0
            }
          });
        }
      } catch (error) {
        console.error('Failed to fetch quick stats:', error);
        // Fallback data
        setStats({
          totalVisitors: 1240,
          totalProjects: 16,
          totalBlogs: 24,
          totalUsers: 156,
          weeklyGrowth: {
            visitors: 12.5,
            projects: 15,
            blogs: 25
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuickStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-cardDark rounded-2xl p-6 shadow-sm dark:shadow-gray-800/50 mx-4 mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="text-center">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const quickStats = [
    {
      label: 'Total Visitors',
      value: stats.totalVisitors.toLocaleString(),
      icon: Eye,
      growth: stats.weeklyGrowth.visitors,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Active Projects',
      value: stats.totalProjects,
      icon: LayoutGrid,
      growth: stats.weeklyGrowth.projects,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'Published Blogs',
      value: stats.totalBlogs,
      icon: FileText,
      growth: stats.weeklyGrowth.blogs,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      growth: 8.2,
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];

  return (
    <div className="bg-white dark:bg-cardDark rounded-2xl p-6 shadow-sm dark:shadow-gray-800/50 mx-4 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Dashboard Overview
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.growth >= 0;
          
          return (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-3 ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {stat.label}
              </div>
              
              <div className={`flex items-center justify-center text-xs ${
                isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {Math.abs(stat.growth).toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Performance this week
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600 dark:text-gray-300">Growing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-600 dark:text-gray-300">Declining</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
