'use client';

import { useState } from 'react';
import { Search, Filter, SortAsc, Grid, List, Eye, Calendar } from 'lucide-react';

interface BlogFiltersProps {
  onSearch: (search: string) => void;
  onSort: (sort: string) => void;
  onViewChange: (view: 'grid' | 'list') => void;
  currentView: 'grid' | 'list';
  totalPosts: number;
}

export default function BlogFilters({
  onSearch,
  onSort,
  onViewChange,
  currentView,
  totalPosts
}: BlogFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleSort = (sort: string) => {
    setSelectedSort(sort);
    onSort(sort);
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title', label: 'Title A-Z' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'popular', label: 'Most Popular' }
  ];

  return (
    <div className="bg-white dark:bg-cardDark rounded-2xl p-6 shadow-sm dark:shadow-gray-800/50 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex items-center gap-3">
          {/* Sort Options */}
          <div className="relative">
            <select
              value={selectedSort}
              onChange={(e) => handleSort(e.target.value)}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <SortAsc className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => onViewChange('grid')}
              className={`p-2 rounded-md transition-colors ${
                currentView === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewChange('list')}
              className={`p-2 rounded-md transition-colors ${
                currentView === 'list'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters (Collapsible) */}
      <div className="mt-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <Filter className="w-4 h-4" />
          Advanced Filters
        </button>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Published Date
                </label>
                <select className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              {/* View Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  View Count
                </label>
                <select className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">Any Views</option>
                  <option value="0-100">0-100 views</option>
                  <option value="100-500">100-500 views</option>
                  <option value="500-1000">500-1000 views</option>
                  <option value="1000+">1000+ views</option>
                </select>
              </div>

              {/* Tags Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Popular Tags
                </label>
                <select className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">All Tags</option>
                  <option value="nextjs">Next.js</option>
                  <option value="react">React</option>
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                  <option value="webdev">Web Development</option>
                  <option value="tutorial">Tutorial</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                Clear All
              </button>
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {searchTerm && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
            Search: "{searchTerm}"
            <button
              onClick={() => handleSearch('')}
              className="ml-1 hover:text-blue-600"
            >
              ×
            </button>
          </span>
        </div>
      )}

      {/* Results Summary */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          Showing {totalPosts} blog post{totalPosts !== 1 ? 's' : ''}
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>Sort by {sortOptions.find(opt => opt.value === selectedSort)?.label}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
