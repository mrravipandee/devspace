'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, FolderOpen, CheckCircle, Clock, Users } from 'lucide-react';

interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  planned: number;
  weeklyGrowth: number;
  avgProgress: number;
  totalMembers: number;
}

export default function ProjectStats() {
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectStats = async () => {
      try {
        const response = await fetch('/api/projects');
        const result = await response.json();
        if (result.success) {
          const data = result.data.stats;
          setStats({
            total: data.total,
            active: data.active,
            completed: data.completed,
            planned: data.planned,
            weeklyGrowth: 15.5, // Mock data
            avgProgress: 65, // Mock data
            totalMembers: 24 // Mock data
          });
        }
      } catch (error) {
        console.error('Failed to fetch project stats:', error);
        // Fallback data
        setStats({
          total: 16,
          active: 8,
          completed: 5,
          planned: 3,
          weeklyGrowth: 15.5,
          avgProgress: 65,
          totalMembers: 24
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjectStats();
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
      label: 'Total Projects',
      value: stats.total,
      icon: FolderOpen,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      trend: stats.weeklyGrowth
    },
    {
      label: 'Active Projects',
      value: stats.active,
      icon: Clock,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      trend: 8.2
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      trend: 12.5
    },
    {
      label: 'Team Members',
      value: stats.totalMembers,
      icon: Users,
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
            Project Overview
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your project statistics and performance
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

      {/* Progress Overview */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Average Progress
          </h3>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.avgProgress}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${stats.avgProgress}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-lg font-semibold text-green-600 dark:text-green-400">
            {stats.active}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Active
          </div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
            {stats.completed}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Completed
          </div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-lg font-semibold text-orange-600 dark:text-orange-400">
            {stats.planned}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Planned
          </div>
        </div>
      </div>
    </div>
  );
}
