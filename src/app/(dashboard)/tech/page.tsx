"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, Trash2, Edit, X, Code, Cpu, Database, Cloud, Layers, Smartphone, 
  Search, Filter, SortAsc, SortDesc, Calendar, Star, TrendingUp, Loader2, Sparkles, Clock, Award,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { toast } from 'sonner';
import SmallCards from "@/components/SmallCards";
import TechImageUpload from "@/components/TechImageUpload";
import { getTechStack, createTechStack, updateTechStack, deleteTechStack, getUserProfile } from '@/lib/apiClient';

interface TechItem {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'other';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  icon: string;
  yearsOfExperience: number;
  lastUsed: string;
  projects: string[];
  description?: string;
  createdAt?: string;
}

interface TechStats {
  total: number;
  byCategory: Record<string, number>;
  byProficiency: Record<string, number>;
  averageExperience: number;
  recentlyUsed: number;
}

export default function TechStackPage() {
  const [techStack, setTechStack] = useState<TechItem[]>([]);
  const [filteredTechStack, setFilteredTechStack] = useState<TechItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTech, setCurrentTech] = useState<TechItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterProficiency, setFilterProficiency] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'proficiency' | 'lastUsed' | 'experience'>('lastUsed');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentUser, setCurrentUser] = useState<{ username: string } | null>(null);
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchTechStack();
    }
  }, [currentUser]);

  const fetchCurrentUser = async () => {
    try {
      const response = await getUserProfile();
      setCurrentUser(response.user);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      toast.error('Failed to load user data');
    }
  };

  const fetchTechStack = async () => {
    if (!currentUser?.username) return;
    
    try {
      setIsLoading(true);
      const response = await getTechStack(currentUser.username);
      setTechStack(response.data || []);
    } catch (error) {
      console.error('Failed to fetch tech stack:', error);
      toast.error('Failed to load tech stack');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort tech stack
  useEffect(() => {
    let filtered = techStack;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(tech =>
        tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.projects.some(project => project.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(tech => tech.category === filterCategory);
    }

    // Apply proficiency filter
    if (filterProficiency !== 'all') {
      filtered = filtered.filter(tech => tech.proficiency === filterProficiency);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'proficiency':
          aValue = a.proficiency;
          bValue = b.proficiency;
          break;
        case 'lastUsed':
          aValue = new Date(a.lastUsed);
          bValue = new Date(b.lastUsed);
          break;
        case 'experience':
          aValue = a.yearsOfExperience;
          bValue = b.yearsOfExperience;
          break;
        default:
          aValue = new Date(a.lastUsed);
          bValue = new Date(b.lastUsed);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTechStack(filtered);
  }, [techStack, searchTerm, filterCategory, filterProficiency, sortBy, sortOrder]);

  const handleCreateNew = () => {
    setCurrentTech({
      id: '',
      name: '',
      category: 'frontend',
      proficiency: 'intermediate',
      icon: '',
      yearsOfExperience: 1,
      lastUsed: new Date().toISOString().split('T')[0],
      projects: [],
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (tech: TechItem) => {
    setCurrentTech(tech);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this technology?')) {
      return;
    }

    try {
      await deleteTechStack(id);
      setTechStack(techStack.filter(tech => tech.id !== id));
      toast.success('Technology deleted successfully');
    } catch (error) {
      console.error('Failed to delete technology:', error);
      toast.error('Failed to delete technology');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTech) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData(e.target as HTMLFormElement);
      
      const techData = {
        name: formData.get('name') as string,
        category: formData.get('category') as TechItem['category'],
        proficiency: formData.get('proficiency') as TechItem['proficiency'],
        icon: currentTech.icon,
        yearsOfExperience: Number(formData.get('yearsOfExperience')),
        lastUsed: formData.get('lastUsed') as string,
        projects: (formData.get('projects') as string).split(',').map(proj => proj.trim()).filter(Boolean),
        description: formData.get('description') as string || ''
      };

      if (currentTech.id) {
        // Update existing tech
        const response = await updateTechStack(currentTech.id, techData);
        setTechStack(techStack.map(tech => 
          tech.id === currentTech.id ? response.data : tech
        ));
        toast.success('Technology updated successfully');
      } else {
        // Create new tech
        const response = await createTechStack(techData);
        setTechStack([response.data, ...techStack]);
        toast.success('Technology added successfully');
      }

      setIsModalOpen(false);
      setCurrentTech(null);
    } catch (error) {
      console.error('Failed to save technology:', error);
      toast.error('Failed to save technology');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (url: string ) => {
    if (currentTech) {
      setCurrentTech({
        ...currentTech,
        icon: url
      });
    }
  };

  const getCategoryIcon = (category: TechItem['category']) => {
    const iconClasses = "w-6 h-6";
    switch (category) {
      case 'frontend': return <Code className={`${iconClasses} text-blue-500`} />;
      case 'backend': return <Cpu className={`${iconClasses} text-green-500`} />;
      case 'database': return <Database className={`${iconClasses} text-orange-500`} />;
      case 'devops': return <Cloud className={`${iconClasses} text-purple-500`} />;
      case 'mobile': return <Smartphone className={`${iconClasses} text-pink-500`} />;
      case 'other': return <Layers className={`${iconClasses} text-gray-500`} />;
      default: return <Layers className={`${iconClasses} text-gray-500`} />;
    }
  };

  const getProficiencyColor = (proficiency: TechItem['proficiency']) => {
    switch (proficiency) {
      case 'beginner': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
      case 'intermediate': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'advanced': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
      case 'expert': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';
    }
  };

  const getTechStats = (): TechStats => {
    const byCategory = techStack.reduce((acc, tech) => {
      acc[tech.category] = (acc[tech.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byProficiency = techStack.reduce((acc, tech) => {
      acc[tech.proficiency] = (acc[tech.proficiency] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageExperience = techStack.length > 0 
      ? Math.round(techStack.reduce((sum, tech) => sum + tech.yearsOfExperience, 0) / techStack.length)
      : 0;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentlyUsed = techStack.filter(tech => new Date(tech.lastUsed) >= thirtyDaysAgo).length;

    return {
      total: techStack.length,
      byCategory,
      byProficiency,
      averageExperience,
      recentlyUsed
    };
  };

  const stats = getTechStats();

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <SmallCards />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {!currentUser ? 'Loading user data...' : 'Loading your tech stack...'}
            </p>
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
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    My Tech Stack
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    The technologies, tools, and frameworks I work with regularly
                  </p>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl border border-white/20 dark:border-gray-700/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <Code className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Technologies</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl border border-white/20 dark:border-gray-700/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.recentlyUsed}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Recent</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl border border-white/20 dark:border-gray-700/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageExperience}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Avg Years</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl border border-white/20 dark:border-gray-700/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                      <Award className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.byProficiency.expert || 0}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Expert Level</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateNew}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl flex items-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg font-medium"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add Technology</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 dark:border-gray-700/50 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              >
                <option value="all">All Categories</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="database">Database</option>
                <option value="devops">DevOps</option>
                <option value="mobile">Mobile</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Proficiency Filter */}
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-gray-400" />
              <select
                value={filterProficiency}
                onChange={(e) => setFilterProficiency(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              {sortOrder === 'asc' ? <SortAsc className="w-5 h-5 text-gray-400" /> : <SortDesc className="w-5 h-5 text-gray-400" />}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'category' | 'proficiency' | 'lastUsed' | 'experience')}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              >
                <option value="lastUsed">Last Used</option>
                <option value="name">Name</option>
                <option value="category">Category</option>
                <option value="proficiency">Proficiency</option>
                <option value="experience">Experience</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tech Stack Grid */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {filteredTechStack.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTechStack.map((tech, index) => (
                  <motion.div
                    key={tech.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          {tech.icon ? (
                            <div className="relative w-12 h-12">
                              <Image
                                src={tech.icon}
                                alt={tech.name}
                                fill
                                className="object-contain"
                                sizes="48px"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl flex items-center justify-center">
                              <Code className="w-6 h-6 text-white" />
                            </div>
                          )}
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {tech.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              {getCategoryIcon(tech.category)}
                              <span className="capitalize">{tech.category}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedTech(tech)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(tech)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors"
                            title="Edit technology"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(tech.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                            title="Delete technology"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${getProficiencyColor(tech.proficiency)}`}>
                          {tech.proficiency}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {tech.yearsOfExperience} {tech.yearsOfExperience === 1 ? 'year' : 'years'} experience
                        </span>
                      </div>

                      {tech.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                          {tech.description}
                        </p>
                      )}

                      <div className="mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span>Last used: {new Date(tech.lastUsed).toLocaleDateString()}</span>
                        </div>
                        {tech.projects.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {tech.projects.slice(0, 3).map(project => (
                              <span 
                                key={project} 
                                className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full font-medium"
                              >
                                {project}
                              </span>
                            ))}
                            {tech.projects.length > 3 && (
                              <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
                                +{tech.projects.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-12 text-center"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Code className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {searchTerm || filterCategory !== 'all' || filterProficiency !== 'all' ? 'No matching technologies' : 'No technologies added yet'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    {searchTerm || filterCategory !== 'all' || filterProficiency !== 'all'
                      ? 'Try adjusting your search or filters to find what you\'re looking for.'
                      : 'Start building your tech stack by adding technologies you work with.'
                    }
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateNew}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-2xl flex items-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg font-medium mx-auto"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Add First Technology</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Create/Edit Tech Modal */}
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
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {currentTech?.id ? 'Edit Technology' : 'Add New Technology'}
                    </h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setIsModalOpen(false);
                      setCurrentTech(null);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Technology Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={currentTech?.name || ''}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                        placeholder="e.g., React, Node.js, MongoDB"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Category *
                      </label>
                      <select
                        name="category"
                        defaultValue={currentTech?.category || 'frontend'}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                        required
                      >
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="database">Database</option>
                        <option value="devops">DevOps</option>
                        <option value="mobile">Mobile</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Proficiency Level *
                      </label>
                      <select
                        name="proficiency"
                        defaultValue={currentTech?.proficiency || 'intermediate'}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                        required
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Years of Experience *
                      </label>
                      <input
                        type="number"
                        name="yearsOfExperience"
                        min="0"
                        max="50"
                        defaultValue={currentTech?.yearsOfExperience || 1}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Last Used Date *
                    </label>
                    <input
                      type="date"
                      name="lastUsed"
                      defaultValue={currentTech?.lastUsed || ''}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Description
                    </label>
                    <textarea
                      name="description"
                      defaultValue={currentTech?.description || ''}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                      placeholder="Describe your experience with this technology..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Projects (comma separated)
                    </label>
                    <input
                      type="text"
                      name="projects"
                      defaultValue={currentTech?.projects.join(', ') || ''}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                      placeholder="Portfolio, E-commerce, Admin Dashboard"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Technology Icon
                    </label>
                    <TechImageUpload
                      currentImage={currentTech?.icon}
                      onImageUpload={handleImageUpload}
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setCurrentTech(null);
                      }}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2 font-medium shadow-lg"
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      <span>{isSubmitting ? 'Saving...' : (currentTech?.id ? 'Update Technology' : 'Add Technology')}</span>
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Technology Details Modal */}
      <AnimatePresence>
        {selectedTech && (
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
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-3">
                    {selectedTech.icon ? (
                      <div className="relative w-16 h-16">
                        <Image
                          src={selectedTech.icon}
                          alt={selectedTech.name}
                          fill
                          className="object-contain"
                          sizes="64px"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center">
                        <Code className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedTech.name}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        {getCategoryIcon(selectedTech.category)}
                        <span className="capitalize">{selectedTech.category}</span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedTech(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${getProficiencyColor(selectedTech.proficiency)}`}>
                      {selectedTech.proficiency}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedTech.yearsOfExperience} {selectedTech.yearsOfExperience === 1 ? 'year' : 'years'} experience
                    </span>
                  </div>

                  {selectedTech.description && (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {selectedTech.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Last used: {new Date(selectedTech.lastUsed).toLocaleDateString()}</span>
                  </div>

                  {selectedTech.projects.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Projects</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTech.projects.map(project => (
                          <span 
                            key={project} 
                            className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full font-medium"
                          >
                            {project}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(selectedTech)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Edit
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}