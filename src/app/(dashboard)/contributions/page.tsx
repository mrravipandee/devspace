"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SmallCards from "@/components/SmallCards";
import ContributionImageUpload from "@/components/ContributionImageUpload";
import { 
  Github, GitPullRequest, Star, GitFork, Code2, PlusCircle, Trash2, Edit, X, 
  Search, Filter, SortAsc, SortDesc, Calendar, ExternalLink, TrendingUp,
  Bug, Zap, FileText, Globe, Settings, Eye, Share2, Download
} from "lucide-react";
import Image from "next/image";
import { toast } from 'sonner';
import { getContributions, createContribution, updateContribution, deleteContribution } from '@/lib/apiClient';

interface Contribution {
  id: string;
  projectName: string;
  projectUrl: string;
  description: string;
  contributionType: 'bug-fix' | 'feature' | 'documentation' | 'translation' | 'other';
  pullRequestUrl: string;
  stars: number;
  forks: number;
  technologies: string[];
  date: string;
  projectLogo?: string;
  createdAt: string;
}

interface ContributionStats {
  totalContributions: number;
  totalStars: number;
  totalForks: number;
  contributionsThisYear: number;
  topTechnologies: { tech: string; count: number }[];
  contributionTypes: { type: string; count: number }[];
}

export default function ContributionsPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [filteredContributions, setFilteredContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContribution, setCurrentContribution] = useState<Contribution | null>(null);
  const [selectedProjectLogo, setSelectedProjectLogo] = useState<string | null>(null);
  const [stats, setStats] = useState<ContributionStats | null>(null);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'projectName' | 'stars' | 'forks'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchContributions();
  }, []);

  useEffect(() => {
    filterAndSortContributions();
  }, [contributions, searchTerm, filterType, sortBy, sortOrder]);

  const fetchContributions = async () => {
    try {
      setIsLoading(true);
      const response = await getContributions();
      setContributions(response.data || []);
      calculateStats(response.data || []);
    } catch (error) {
      console.error('Failed to fetch contributions:', error);
      toast.error('Failed to load contributions');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (contributionsData: Contribution[]) => {
    const totalContributions = contributionsData.length;
    const totalStars = contributionsData.reduce((sum, c) => sum + c.stars, 0);
    const totalForks = contributionsData.reduce((sum, c) => sum + c.forks, 0);
    const currentYear = new Date().getFullYear();
    const contributionsThisYear = contributionsData.filter(c => 
      new Date(c.date).getFullYear() === currentYear
    ).length;

    // Calculate top technologies
    const techCount: { [key: string]: number } = {};
    contributionsData.forEach(c => {
      c.technologies.forEach(tech => {
        techCount[tech] = (techCount[tech] || 0) + 1;
      });
    });
    const topTechnologies = Object.entries(techCount)
      .map(([tech, count]) => ({ tech, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate contribution types
    const typeCount: { [key: string]: number } = {};
    contributionsData.forEach(c => {
      typeCount[c.contributionType] = (typeCount[c.contributionType] || 0) + 1;
    });
    const contributionTypes = Object.entries(typeCount)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    setStats({
      totalContributions,
      totalStars,
      totalForks,
      contributionsThisYear,
      topTechnologies,
      contributionTypes
    });
  };

  const filterAndSortContributions = () => {
    let filtered = contributions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(contribution =>
        contribution.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contribution.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contribution.technologies.some(tech => 
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(contribution => contribution.contributionType === filterType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'projectName':
          aValue = a.projectName.toLowerCase();
          bValue = b.projectName.toLowerCase();
          break;
        case 'stars':
          aValue = a.stars;
          bValue = b.stars;
          break;
        case 'forks':
          aValue = a.forks;
          bValue = b.forks;
          break;
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredContributions(filtered);
  };

  const handleCreateNew = () => {
    setCurrentContribution({
      id: '',
      projectName: '',
      projectUrl: '',
      description: '',
      contributionType: 'bug-fix',
      pullRequestUrl: '',
      stars: 0,
      forks: 0,
      technologies: [],
      date: new Date().toISOString().split('T')[0],
      projectLogo: '',
      createdAt: ''
    });
    setSelectedProjectLogo(null);
    setIsModalOpen(true);
  };

  const handleEdit = (contribution: Contribution) => {
    setCurrentContribution(contribution);
    setSelectedProjectLogo(contribution.projectLogo || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this contribution?')) {
      try {
        await deleteContribution(id);
        setContributions(contributions.filter(contribution => contribution.id !== id));
        toast.success('Contribution deleted successfully');
      } catch (error) {
        console.error('Failed to delete contribution:', error);
        toast.error('Failed to delete contribution');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const contributionData = {
      projectName: formData.get('projectName') as string,
      projectUrl: formData.get('projectUrl') as string,
      description: formData.get('description') as string,
      contributionType: formData.get('contributionType') as Contribution['contributionType'],
      pullRequestUrl: formData.get('pullRequestUrl') as string,
      stars: Number(formData.get('stars')),
      forks: Number(formData.get('forks')),
      technologies: (formData.get('technologies') as string).split(',').map(tech => tech.trim()).filter(Boolean),
      date: formData.get('date') as string,
      projectLogo: selectedProjectLogo || ''
    };

    try {
      if (currentContribution?.id) {
        // Update existing contribution
        const response = await updateContribution(currentContribution.id, contributionData);
        setContributions(contributions.map(contribution => 
          contribution.id === currentContribution.id ? response.data : contribution
        ));
        toast.success('Contribution updated successfully');
      } else {
        // Add new contribution
        const response = await createContribution(contributionData);
        setContributions([...contributions, response.data]);
        toast.success('Contribution added successfully');
      }

      setIsModalOpen(false);
      setCurrentContribution(null);
      setSelectedProjectLogo(null);
    } catch (error) {
      console.error('Failed to save contribution:', error);
      toast.error('Failed to save contribution');
    }
  };

  const getContributionTypeColor = (type: Contribution['contributionType']) => {
    switch (type) {
      case 'bug-fix': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      case 'feature': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'documentation': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
      case 'translation': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200';
      case 'other': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';
    }
  };

  const getContributionTypeIcon = (type: Contribution['contributionType']) => {
    switch (type) {
      case 'bug-fix': return <Bug className="w-4 h-4" />;
      case 'feature': return <Zap className="w-4 h-4" />;
      case 'documentation': return <FileText className="w-4 h-4" />;
      case 'translation': return <Globe className="w-4 h-4" />;
      case 'other': return <Settings className="w-4 h-4" />;
      default: return <Code2 className="w-4 h-4" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <SmallCards />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your contributions...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SmallCards />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <Github className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Open Source Contributions
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    A showcase of my contributions to open source projects and communities.
                  </p>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateNew}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg"
            >
              <PlusCircle className="w-5 h-5" />
              Add Contribution
            </motion.button>
          </div>
        </motion.div>

        {/* Statistics Dashboard */}
        {stats && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Contributions</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalContributions}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Code2 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Stars</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.totalStars)}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Forks</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.totalForks)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <GitFork className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Year</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.contributionsThisYear}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search contributions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Types</option>
                  <option value="bug-fix">Bug Fix</option>
                  <option value="feature">Feature</option>
                  <option value="documentation">Documentation</option>
                  <option value="translation">Translation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                {sortOrder === 'asc' ? <SortAsc className="w-5 h-5 text-gray-400" /> : <SortDesc className="w-5 h-5 text-gray-400" />}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="date">Date</option>
                  <option value="projectName">Project Name</option>
                  <option value="stars">Stars</option>
                  <option value="forks">Forks</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <SortDesc className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contributions List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {filteredContributions.length > 0 ? (
            filteredContributions.map((contribution, index) => (
              <motion.div
                key={contribution.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Project Logo */}
                    <div className="flex-shrink-0">
                      {contribution.projectLogo ? (
                        <div className="relative w-16 h-16">
                          <Image
                            src={contribution.projectLogo}
                            alt={contribution.projectName}
                            fill
                            className="object-contain rounded-xl"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                          <Github className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                <a 
                                  href={contribution.projectUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="hover:text-blue-600 transition-colors flex items-center gap-2"
                                >
                                  {contribution.projectName}
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </h3>
                              <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${getContributionTypeColor(contribution.contributionType)}`}>
                                  {getContributionTypeIcon(contribution.contributionType)}
                                  {contribution.contributionType.replace('-', ' ')}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(contribution.date).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </span>
                              </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleEdit(contribution)}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Edit contribution"
                              >
                                <Edit className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDelete(contribution.id)}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete contribution"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>

                          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                            {contribution.description}
                          </p>

                          {/* Links and Stats */}
                          <div className="flex flex-wrap items-center gap-4 mb-4">
                            <a 
                              href={contribution.pullRequestUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                            >
                              <GitPullRequest className="w-4 h-4" />
                              View Pull Request
                            </a>

                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4" />
                                {formatNumber(contribution.stars)}
                              </span>
                              <span className="flex items-center gap-1">
                                <GitFork className="w-4 h-4" />
                                {formatNumber(contribution.forks)}
                              </span>
                            </div>
                          </div>

                          {/* Technologies */}
                          {contribution.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {contribution.technologies.map(tech => (
                                <span 
                                  key={tech} 
                                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-3 py-1 rounded-full font-medium"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-12 text-center"
            >
              <div className="mx-auto max-w-md">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Code2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {searchTerm || filterType !== 'all' ? 'No contributions found' : 'No contributions yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  {searchTerm || filterType !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Start building your open source portfolio by adding your first contribution.'
                  }
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateNew}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg mx-auto"
                >
                  <PlusCircle className="w-5 h-5" />
                  Add First Contribution
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Create/Edit Contribution Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentContribution?.id ? 'Edit Contribution' : 'Add New Contribution'}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsModalOpen(false);
                      setCurrentContribution(null);
                      setSelectedProjectLogo(null);
                    }}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Project Name*
                      </label>
                      <input
                        type="text"
                        name="projectName"
                        defaultValue={currentContribution?.projectName || ''}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                        placeholder="e.g. Next.js"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contribution Type*
                      </label>
                      <select
                        name="contributionType"
                        defaultValue={currentContribution?.contributionType || 'bug-fix'}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      >
                        <option value="bug-fix">Bug Fix</option>
                        <option value="feature">Feature</option>
                        <option value="documentation">Documentation</option>
                        <option value="translation">Translation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Project URL*
                      </label>
                      <input
                        type="url"
                        name="projectUrl"
                        defaultValue={currentContribution?.projectUrl || ''}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                        placeholder="https://github.com/org/repo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Pull Request URL*
                      </label>
                      <input
                        type="url"
                        name="pullRequestUrl"
                        defaultValue={currentContribution?.pullRequestUrl || ''}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                        placeholder="https://github.com/org/repo/pull/123"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description*
                    </label>
                    <textarea
                      name="description"
                      defaultValue={currentContribution?.description || ''}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                      placeholder="Describe your contribution..."
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Stars
                      </label>
                      <input
                        type="number"
                        name="stars"
                        min="0"
                        defaultValue={currentContribution?.stars || 0}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Forks
                      </label>
                      <input
                        type="number"
                        name="forks"
                        min="0"
                        defaultValue={currentContribution?.forks || 0}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date*
                      </label>
                      <input
                        type="date"
                        name="date"
                        defaultValue={currentContribution?.date || ''}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Technologies
                      </label>
                      <input
                        type="text"
                        name="technologies"
                        defaultValue={currentContribution?.technologies.join(', ') || ''}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="React, JavaScript, TypeScript"
                      />
                    </div>
                  </div>

                  {/* Project Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Project Logo
                    </label>
                    <ContributionImageUpload
                      onImageUpload={setSelectedProjectLogo}
                      currentImage={currentContribution?.projectLogo || null}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setCurrentContribution(null);
                        setSelectedProjectLogo(null);
                      }}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg"
                    >
                      {currentContribution?.id ? 'Update Contribution' : 'Add Contribution'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}