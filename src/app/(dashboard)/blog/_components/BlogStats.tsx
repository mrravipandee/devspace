'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, FileText, Eye, Users, Calendar } from 'lucide-react';

interface BlogStats {
  total: number;
  totalViews: number;
  avgViews: number;
  recentPosts: number;
  weeklyGrowth: number;
  engagementRate: number;
}

export default function BlogStats() {
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogStats = async () => {
      try {
        const response = await fetch('/api/blog');
        const result = await response.json();
        if (result.success) {
          const data = result.data.stats;
          setStats({
            total: data.total,
            totalViews: data.totalViews,
            avgViews: data.avgViews,
            recentPosts: data.recentPosts,
            weeklyGrowth: 12.5, // Mock data
            engagementRate: 78 // Mock data
          });
        }
      } catch (error) {
        console.error('Failed to fetch blog stats:', error);
        // Fallback data
        setStats({
          total: 24,
          totalViews: 1240,
          avgViews: 52,
          recentPosts: 3,
          weeklyGrowth: 12.5,
          engagementRate: 78
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-cardDark rounded-2xl p-6 shadow-sm dark:shadow-gray-800/50 mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="text-center">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      label: 'Total Posts',
      value: stats.total,
      icon: FileText,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      trend: stats.weeklyGrowth
    },
    {
      label: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      trend: 8.2
    },
    {
      label: 'Avg Views',
      value: stats.avgViews,
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      trend: 15.5
    },
    {
      label: 'Engagement',
      value: `${stats.engagementRate}%`,
      icon: Calendar,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      trend: 5.8
    }
  ];

  return (
    <div className="bg-white dark:bg-cardDark rounded-2xl p-6 shadow-sm dark:shadow-gray-800/50 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Blog Overview
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your blog performance and statistics
          </p>
        </div>
        <div className="flex items-center text-sm text-green-600 dark:text-green-400">
          <TrendingUp className="w-4 h-4 mr-1" />
          {stats.weeklyGrowth}% this week
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.trend >= 0;
          
          return (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} ${stat.color} mb-3`}>
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
                {Math.abs(stat.trend).toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Overview */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Performance Metrics
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Last 30 days
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Views per Post</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.avgViews}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((stats.avgViews / 100) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.engagementRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.engagementRate}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Recent Posts</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.recentPosts}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((stats.recentPosts / 10) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
          <div className="flex gap-2">
            <button className="text-blue-600 dark:text-blue-400 hover:underline">
              View Analytics
            </button>
            <span className="text-gray-300">|</span>
            <button className="text-blue-600 dark:text-blue-400 hover:underline">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
