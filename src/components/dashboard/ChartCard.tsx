"use client";

import { motion } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  value?: string;
  children: React.ReactNode;
  delay?: number;
}

export default function ChartCard({ 
  title, 
  subtitle, 
  value, 
  children, 
  delay = 0 
}: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {value && (
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
      {children}
    </motion.div>
  );
}

