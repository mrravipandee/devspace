"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, Plus, X, CheckCircle, User, MapPin, Briefcase, Globe, Link as LinkIcon, Save, Sparkles } from 'lucide-react';
import { getUserProfile, updateUserProfile } from '@/lib/apiClient';
import ImageUpload from '@/components/ImageUpload';

interface SocialHandle {
    platform: string;
    url: string;
}

interface UsefulLink {
    title: string;
    url: string;
}

export default function EditProfilePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        bio: '',
        profileImage: '',
        profileImagePublicId: '',
        location: '',
        availableForWork: false,
        socialHandles: [] as SocialHandle[],
        usefulLinks: [] as UsefulLink[],
        profileCompleted: false
    });

    const [originalData, setOriginalData] = useState(formData);

    // Fetch current profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const response = await getUserProfile();
                const profile = response.user;
                
                const data = {
                    fullName: profile.fullName || '',
                    username: profile.username || '',
                    bio: profile.bio || '',
                    profileImage: profile.profileImage || '',
                    profileImagePublicId: profile.profileImagePublicId || '',
                    location: profile.location || '',
                    availableForWork: profile.availableForWork || false,
                    socialHandles: profile.socialHandles || [],
                    usefulLinks: profile.usefulLinks || [],
                    profileCompleted: profile.profileCompleted || false
                };
                
                setFormData(data);
                setOriginalData(data);
            } catch (error: unknown) {
                const errorMessage = error instanceof Error && 'response' in error && 
                    typeof error.response === 'object' && error.response && 'data' in error.response &&
                    typeof error.response.data === 'object' && error.response.data && 'error' in error.response.data
                    ? (error.response.data as { error: string }).error 
                    : 'Failed to load profile';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Check for unsaved changes
    useEffect(() => {
        const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
        setHasUnsavedChanges(hasChanges);
    }, [formData, originalData]);

    // Warn user before leaving with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageUpload = (url: string, publicId: string) => {
        setFormData(prev => ({
            ...prev,
            profileImage: url,
            profileImagePublicId: publicId
        }));
    };

    const addSocialHandle = () => {
        setFormData(prev => ({
            ...prev,
            socialHandles: [...prev.socialHandles, { platform: '', url: '' }]
        }));
    };

    const removeSocialHandle = (index: number) => {
        setFormData(prev => ({
            ...prev,
            socialHandles: prev.socialHandles.filter((_, i) => i !== index)
        }));
    };

    const updateSocialHandle = (index: number, field: 'platform' | 'url', value: string) => {
        setFormData(prev => ({
            ...prev,
            socialHandles: prev.socialHandles.map((handle, i) => 
                i === index ? { ...handle, [field]: value } : handle
            )
        }));
    };

    const addUsefulLink = () => {
        setFormData(prev => ({
            ...prev,
            usefulLinks: [...prev.usefulLinks, { title: '', url: '' }]
        }));
    };

    const removeUsefulLink = (index: number) => {
        setFormData(prev => ({
            ...prev,
            usefulLinks: prev.usefulLinks.filter((_, i) => i !== index)
        }));
    };

    const updateUsefulLink = (index: number, field: 'title' | 'url', value: string) => {
        setFormData(prev => ({
            ...prev,
            usefulLinks: prev.usefulLinks.map((link, i) => 
                i === index ? { ...link, [field]: value } : link
            )
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setIsSaving(true);
            
            // Filter out empty social handles and useful links
            const filteredSocialHandles = formData.socialHandles.filter(
                handle => handle.platform.trim() && handle.url.trim()
            );
            const filteredUsefulLinks = formData.usefulLinks.filter(
                link => link.title.trim() && link.url.trim()
            );

            const updateData = {
                ...formData,
                socialHandles: filteredSocialHandles,
                usefulLinks: filteredUsefulLinks
            };

            const response = await updateUserProfile(updateData);
            
            // Update original data to clear unsaved changes flag
            setOriginalData(updateData);
            setHasUnsavedChanges(false);
            
            // Check if profile was just completed
            if (response.user.profileCompleted && !formData.profileCompleted) {
                toast.success('🎉 Profile completed successfully! Welcome to DevSpace!');
            } else {
                toast.success('Profile updated successfully!');
            }
            
            router.push('/profile');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error && 'response' in error && 
                typeof error.response === 'object' && error.response && 'data' in error.response &&
                typeof error.response.data === 'object' && error.response.data && 'error' in error.response.data
                ? (error.response.data as { error: string }).error 
                : 'Failed to update profile';
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    // Calculate completion percentage
    const getCompletionPercentage = () => {
        let completed = 0;
        if (formData.fullName?.trim()) completed += 25;
        if (formData.bio?.trim()) completed += 25;
        if (formData.profileImage) completed += 25;
        if (formData.location?.trim()) completed += 25;
        return completed;
    };

    // Get completion status
    const getCompletionStatus = () => {
        const percentage = getCompletionPercentage();
        if (percentage === 100) return { status: 'Complete', color: 'text-green-600', bg: 'bg-green-100' };
        if (percentage >= 75) return { status: 'Almost Complete', color: 'text-blue-600', bg: 'bg-blue-100' };
        if (percentage >= 50) return { status: 'Halfway There', color: 'text-yellow-600', bg: 'bg-yellow-100' };
        return { status: 'Getting Started', color: 'text-gray-600', bg: 'bg-gray-100' };
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your profile...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <p className="text-red-600 dark:text-red-400 mb-4 text-lg">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                    >
                        Try Again
                    </button>
                </motion.div>
            </div>
        );
    }

    const completionStatus = getCompletionStatus();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
                >
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => router.back()}
                                    className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                </motion.button>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
                                    <p className="text-blue-100 text-sm">Update your profile information</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                {/* Unsaved Changes Indicator */}
                                <AnimatePresence>
                                    {hasUnsavedChanges && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="flex items-center space-x-2 bg-yellow-500/20 backdrop-blur-sm px-3 py-2 rounded-xl border border-yellow-300/30"
                                        >
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                            <span className="text-yellow-100 text-sm font-medium">Unsaved changes</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Public Profile URL */}
                                <div className="hidden lg:flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
                                    <div className="text-white text-sm font-medium">Public Profile</div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-white text-sm font-mono">
                                            devspace.me/{formData.username}
                                        </span>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText(`https://devspace.me/${formData.username}`);
                                                toast.success('Profile URL copied to clipboard!');
                                            }}
                                            className="text-white hover:text-blue-200 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Profile Completion Progress */}
                                <div className="hidden lg:flex items-center space-x-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
                                    <div className="text-white text-sm font-medium">Completion</div>
                                    <div className="w-24 bg-white/30 rounded-full h-2">
                                        <motion.div 
                                            className="bg-white h-2 rounded-full transition-all duration-300"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${getCompletionPercentage()}%` }}
                                        ></motion.div>
                                    </div>
                                    <span className="text-white text-sm font-bold">
                                        {getCompletionPercentage()}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Profile Completion Checklist */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6"
                        >
                            <div className="flex items-center space-x-3 mb-4">
                                <Sparkles className="w-6 h-6 text-blue-600" />
                                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                                    Profile Completion Checklist
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${completionStatus.bg} ${completionStatus.color}`}>
                                    {completionStatus.status}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                                        formData.fullName?.trim() 
                                            ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800' 
                                            : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                                    }`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                        formData.fullName?.trim() ? 'bg-green-500' : 'bg-gray-400'
                                    }`}>
                                        {formData.fullName?.trim() && <CheckCircle className="w-4 h-4 text-white" />}
                                    </div>
                                    <span className={`font-medium transition-colors ${
                                        formData.fullName?.trim() 
                                            ? 'text-green-800 dark:text-green-200' 
                                            : 'text-gray-600 dark:text-gray-400'
                                    }`}>Full Name</span>
                                </motion.div>

                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                                        formData.bio?.trim() 
                                            ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800' 
                                            : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                                    }`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                        formData.bio?.trim() ? 'bg-green-500' : 'bg-gray-400'
                                    }`}>
                                        {formData.bio?.trim() && <CheckCircle className="w-4 h-4 text-white" />}
                                    </div>
                                    <span className={`font-medium transition-colors ${
                                        formData.bio?.trim() 
                                            ? 'text-green-800 dark:text-green-200' 
                                            : 'text-gray-600 dark:text-gray-400'
                                    }`}>Bio</span>
                                </motion.div>

                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                                        formData.profileImage 
                                            ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800' 
                                            : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                                    }`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                        formData.profileImage ? 'bg-green-500' : 'bg-gray-400'
                                    }`}>
                                        {formData.profileImage && <CheckCircle className="w-4 h-4 text-white" />}
                                    </div>
                                    <span className={`font-medium transition-colors ${
                                        formData.profileImage 
                                            ? 'text-green-800 dark:text-green-200' 
                                            : 'text-gray-600 dark:text-gray-400'
                                    }`}>Profile Image</span>
                                </motion.div>

                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                                        formData.location?.trim() 
                                            ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800' 
                                            : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                                    }`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                        formData.location?.trim() ? 'bg-green-500' : 'bg-gray-400'
                                    }`}>
                                        {formData.location?.trim() && <CheckCircle className="w-4 h-4 text-white" />}
                                    </div>
                                    <span className={`font-medium transition-colors ${
                                        formData.location?.trim() 
                                            ? 'text-green-800 dark:text-green-200' 
                                            : 'text-gray-600 dark:text-gray-400'
                                    }`}>Location</span>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Basic Information */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl border border-white/20 dark:border-gray-700/50"
                        >
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Basic Information
                                </h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Username *
                                    </label>
                                    <input
                                        type="text"
                                        disabled
                                        value={formData.username}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-700 dark:text-white transition-all duration-200 cursor-not-allowed"
                                        placeholder="Enter your username"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Username cannot be changed</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Bio *
                                </label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                                    placeholder="Tell us about yourself, your skills, and what you do..."
                                    required
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {formData.bio.length}/500 characters
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Profile Image
                                    </label>
                                    <ImageUpload
                                        currentImage={formData.profileImage}
                                        onImageUpload={handleImageUpload}
                                        className="w-full"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Location
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                                            placeholder="City, Country"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="availableForWork"
                                        checked={formData.availableForWork}
                                        onChange={(e) => handleInputChange('availableForWork', e.target.checked)}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                                    />
                                    <div className="flex items-center space-x-2">
                                        <Briefcase className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Available for work
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </motion.div>

                        {/* Social Handles */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl border border-white/20 dark:border-gray-700/50"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                        <Globe className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Social Handles
                                    </h2>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={addSocialHandle}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add</span>
                                </motion.button>
                            </div>
                            
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {formData.socialHandles.map((handle, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                                        >
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={handle.platform}
                                                    onChange={(e) => updateSocialHandle(index, 'platform', e.target.value)}
                                                    placeholder="Platform (e.g., GitHub, LinkedIn)"
                                                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                                                />
                                                <input
                                                    type="url"
                                                    value={handle.url}
                                                    onChange={(e) => updateSocialHandle(index, 'url', e.target.value)}
                                                    placeholder="URL"
                                                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                                                />
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                type="button"
                                                onClick={() => removeSocialHandle(index)}
                                                className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {formData.socialHandles.length === 0 && (
                                    <div className="text-center py-8">
                                        <Globe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500 dark:text-gray-400">No social handles added yet</p>
                                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add your social media profiles to connect with others</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Useful Links */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl border border-white/20 dark:border-gray-700/50"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                                        <LinkIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Useful Links
                                    </h2>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={addUsefulLink}
                                    className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add</span>
                                </motion.button>
                            </div>
                            
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {formData.usefulLinks.map((link, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                                        >
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={link.title}
                                                    onChange={(e) => updateUsefulLink(index, 'title', e.target.value)}
                                                    placeholder="Link Title"
                                                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                                                />
                                                <input
                                                    type="url"
                                                    value={link.url}
                                                    onChange={(e) => updateUsefulLink(index, 'url', e.target.value)}
                                                    placeholder="URL"
                                                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                                                />
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                type="button"
                                                onClick={() => removeUsefulLink(index)}
                                                className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {formData.usefulLinks.length === 0 && (
                                    <div className="text-center py-8">
                                        <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500 dark:text-gray-400">No useful links added yet</p>
                                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add links to your projects, portfolio, or other resources</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => router.back()}
                                className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={isSaving}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2 font-medium shadow-lg"
                            >
                                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                <Save className="w-4 h-4" />
                                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}