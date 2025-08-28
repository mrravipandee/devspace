"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, Trash2, Edit, X, Award, Trophy, FileBadge, Briefcase, Search,
  Filter, SortAsc, SortDesc, Calendar, ExternalLink, Star, TrendingUp,
  CheckCircle, Loader2, Sparkles, Target, Medal, Eye, Share2, Download
} from "lucide-react";
import Image from "next/image";
import { toast } from 'sonner';
import SmallCards from "@/components/SmallCards";
import AchievementImageUpload from "@/components/AchievementImageUpload";
import { getAchievements, createAchievement, updateAchievement, deleteAchievement, getUserProfile } from '@/lib/apiClient';

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'certification' | 'hackathon' | 'internship' | 'project' | 'challenge';
  image: string;
  issuer: string;
  date: string;
  verificationUrl: string;
  skills: string[];
  createdAt?: string;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filteredAchievements, setFilteredAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentUser, setCurrentUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchAchievements();
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

  useEffect(() => {
    let filtered = achievements || [];
    if (searchTerm) {
      filtered = filtered.filter(achievement =>
        achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        achievement.issuer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterType !== 'all') {
      filtered = filtered.filter(achievement => achievement.type === filterType);
    }
    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
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
    setFilteredAchievements(filtered);
  }, [achievements, searchTerm, filterType, sortBy, sortOrder]);

  const fetchAchievements = async () => {
    if (!currentUser?.username) return;
    
    try {
      setIsLoading(true);
      const response = await getAchievements(currentUser.username);
      setAchievements(response.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
      toast.error('Failed to load achievements');
      setAchievements([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setCurrentAchievement({
      id: '', title: '', description: '', type: 'certification', image: '',
      issuer: '', date: new Date().toISOString().split('T')[0], verificationUrl: '', skills: []
    });
    setIsModalOpen(true);
  };

  const handleEdit = (achievement: Achievement) => {
    setCurrentAchievement(achievement);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;
    try {
      await deleteAchievement(id);
      setAchievements(achievements?.filter(achievement => achievement.id !== id) || []);
      toast.success('Achievement deleted successfully');
    } catch (error) {
      toast.error('Failed to delete achievement');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAchievement) return;
    try {
      setIsSubmitting(true);
      const formData = new FormData(e.target as HTMLFormElement);
      const achievementData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        type: formData.get('type') as Achievement['type'],
        image: currentAchievement.image,
        issuer: formData.get('issuer') as string,
        date: formData.get('date') as string,
        verificationUrl: formData.get('verificationUrl') as string,
        skills: (formData.get('skills') as string || '').split(',').map(skill => skill.trim()).filter(Boolean),
      };
      if (currentAchievement.id) {
        const response = await updateAchievement(currentAchievement.id, achievementData);
        setAchievements(achievements?.map(achievement => 
          achievement.id === currentAchievement.id ? response.data : achievement
        ) || []);
        toast.success('Achievement updated successfully');
      } else {
        const response = await createAchievement(achievementData);
        setAchievements([response.data, ...(achievements || [])]);
        toast.success('Achievement created successfully');
      }
      setIsModalOpen(false);
      setCurrentAchievement(null);
    } catch (error) {
      toast.error('Failed to save achievement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (url: string, publicId: string) => {
    if (currentAchievement) {
      setCurrentAchievement({ ...currentAchievement, image: url });
    }
  };

  const getAchievementIcon = (type: Achievement['type']) => {
    const iconClasses = "w-6 h-6";
    switch (type) {
      case 'certification': return <FileBadge className={`${iconClasses} text-blue-500`} />;
      case 'hackathon': return <Trophy className={`${iconClasses} text-yellow-500`} />;
      case 'internship': return <Briefcase className={`${iconClasses} text-green-500`} />;
      case 'project': return <Target className={`${iconClasses} text-purple-500`} />;
      case 'challenge': return <Medal className={`${iconClasses} text-red-500`} />;
      default: return <Award className={`${iconClasses} text-gray-500`} />;
    }
  };

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
              {!currentUser ? 'Loading user data...' : 'Loading your achievements...'}
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
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Achievements</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Showcase your professional accomplishments</p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl border border-white/20 dark:border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <Award className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{achievements?.length || 0}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl border border-white/20 dark:border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {achievements?.filter(a => new Date(a.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length || 0}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Recent</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl border border-white/20 dark:border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {achievements?.filter(a => a.verificationUrl).length || 0}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Verified</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl border border-white/20 dark:border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                      <Star className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {achievements && achievements.length > 0 ? Math.round((achievements.filter(a => a.verificationUrl).length / achievements.length) * 100) : 0}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Completion</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateNew}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl flex items-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg font-medium"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add Achievement</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 dark:border-gray-700/50 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              >
                <option value="all">All Types</option>
                <option value="certification">Certification</option>
                <option value="hackathon">Hackathon</option>
                <option value="internship">Internship</option>
                <option value="project">Project</option>
                <option value="challenge">Challenge</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              {sortOrder === 'asc' ? <SortAsc className="w-5 h-5 text-gray-400" /> : <SortDesc className="w-5 h-5 text-gray-400" />}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'type')}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              >
                <option value="date">Date</option>
                <option value="title">Title</option>
                <option value="type">Type</option>
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

        {/* Achievements Grid */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {filteredAchievements && filteredAchievements.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row h-full">
                      {achievement.image && (
                        <div className="relative w-full lg:w-1/3 h-48 lg:h-auto">
                          <Image
                            src={achievement.image}
                            alt={achievement.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute top-3 right-3">
                            {getAchievementIcon(achievement.type)}
                          </div>
                        </div>
                      )}

                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                              {achievement.title}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                              <span>{achievement.issuer}</span>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(achievement.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(achievement)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(achievement.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {achievement.description}
                        </p>

                        {achievement.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {achievement.skills?.slice(0, 3).map(skill => (
                              <span 
                                key={skill} 
                                className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 text-xs px-3 py-1 rounded-full font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            {achievement.skills && achievement.skills.length > 3 && (
                              <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-full">
                                +{achievement.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <a 
                            href={achievement.verificationUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Verify this achievement</span>
                          </a>
                        </div>
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
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {searchTerm || filterType !== 'all' ? 'No matching achievements' : 'No achievements yet'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    {searchTerm || filterType !== 'all' 
                      ? 'Try adjusting your search or filters to find what you\'re looking for.'
                      : 'Start building your achievements portfolio by adding your first accomplishment.'
                    }
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateNew}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-2xl flex items-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg font-medium mx-auto"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Add First Achievement</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Create/Edit Modal */}
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
                      {currentAchievement?.id ? 'Edit Achievement' : 'Add New Achievement'}
                    </h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setIsModalOpen(false);
                      setCurrentAchievement(null);
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
                        Achievement Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        defaultValue={currentAchievement?.title || ''}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                        placeholder="e.g., AWS Certified Developer"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Type *
                      </label>
                      <select
                        name="type"
                        defaultValue={currentAchievement?.type || 'certification'}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                        required
                      >
                        <option value="certification">Certification</option>
                        <option value="hackathon">Hackathon</option>
                        <option value="internship">Internship</option>
                        <option value="project">Project</option>
                        <option value="challenge">Coding Challenge</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      defaultValue={currentAchievement?.description || ''}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                      placeholder="Describe your achievement and what you learned..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Issuer/Organization *
                      </label>
                      <input
                        type="text"
                        name="issuer"
                        defaultValue={currentAchievement?.issuer || ''}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                        placeholder="e.g., Amazon Web Services"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Date Achieved *
                      </label>
                      <input
                        type="date"
                        name="date"
                        defaultValue={currentAchievement?.date || ''}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Verification URL *
                    </label>
                    <input
                      type="url"
                      name="verificationUrl"
                      defaultValue={currentAchievement?.verificationUrl || ''}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                      placeholder="https://example.com/verification"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Skills & Technologies (comma separated)
                    </label>
                    <input
                      type="text"
                      name="skills"
                      defaultValue={currentAchievement?.skills?.join(', ') || ''}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200"
                      placeholder="JavaScript, React, Cloud Computing, AWS"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Certificate/Badge Image
                    </label>
                    <AchievementImageUpload
                      currentImage={currentAchievement?.image}
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
                        setCurrentAchievement(null);
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
                      <span>{isSubmitting ? 'Saving...' : (currentAchievement?.id ? 'Update Achievement' : 'Add Achievement')}</span>
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