"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Plus, X } from 'lucide-react';
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

interface ProfileData {
    id: string;
    username: string;
    email: string;
    fullName: string;
    bio: string;
    profileImage: string;
    profileImagePublicId: string;
    location: string;
    availableForWork: boolean;
    socialHandles: SocialHandle[];
    usefulLinks: UsefulLink[];
    profileCompleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function EditProfilePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        bio: '',
        profileImage: '',
        profileImagePublicId: '',
        location: '',
        availableForWork: false,
        socialHandles: [] as SocialHandle[],
        usefulLinks: [] as UsefulLink[]
    });

    // Fetch current profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const response = await getUserProfile();
                const profile = response.user;
                
                setFormData({
                    fullName: profile.fullName || '',
                    username: profile.username || '',
                    bio: profile.bio || '',
                    profileImage: profile.profileImage || '',
                    profileImagePublicId: profile.profileImagePublicId || '',
                    location: profile.location || '',
                    availableForWork: profile.availableForWork || false,
                    socialHandles: profile.socialHandles || [],
                    usefulLinks: profile.usefulLinks || []
                });
            } catch (error: any) {
                const errorMessage = error.response?.data?.error || 'Failed to load profile';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (field: string, value: any) => {
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

            await updateUserProfile(updateData);
            toast.success('Profile updated successfully!');
            router.push('/profile');
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Failed to update profile';
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-cardDark">
                <Loader2 className="w-12 h-12 animate-spin text-primary/80" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-cardDark">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-cardDark">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-cardDark rounded-xl shadow-md overflow-hidden"
                >
                    {/* Header */}
                    <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => router.back()}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <h1 className="text-2xl font-bold text-primaryText dark:text-background">
                                    Edit Profile
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-primaryText dark:text-background">
                                Basic Information
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Username *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => handleInputChange('username', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Bio *
                                </label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="Tell us about yourself..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Profile Image
                                    </label>
                                    <ImageUpload
                                        currentImage={formData.profileImage}
                                        onImageUpload={handleImageUpload}
                                        className="w-full"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        placeholder="City, Country"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="availableForWork"
                                    checked={formData.availableForWork}
                                    onChange={(e) => handleInputChange('availableForWork', e.target.checked)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="availableForWork" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    Available for work
                                </label>
                            </div>
                        </div>

                        {/* Social Handles */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-primaryText dark:text-background">
                                    Social Handles
                                </h2>
                                <button
                                    type="button"
                                    onClick={addSocialHandle}
                                    className="flex items-center space-x-2 px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add</span>
                                </button>
                            </div>
                            
                            {formData.socialHandles.map((handle, index) => (
                                <div key={index} className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={handle.platform}
                                            onChange={(e) => updateSocialHandle(index, 'platform', e.target.value)}
                                            placeholder="Platform (e.g., GitHub, LinkedIn)"
                                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                        <input
                                            type="url"
                                            value={handle.url}
                                            onChange={(e) => updateSocialHandle(index, 'url', e.target.value)}
                                            placeholder="URL"
                                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeSocialHandle(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Useful Links */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-primaryText dark:text-background">
                                    Useful Links
                                </h2>
                                <button
                                    type="button"
                                    onClick={addUsefulLink}
                                    className="flex items-center space-x-2 px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add</span>
                                </button>
                            </div>
                            
                            {formData.usefulLinks.map((link, index) => (
                                <div key={index} className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={link.title}
                                            onChange={(e) => updateUsefulLink(index, 'title', e.target.value)}
                                            placeholder="Link Title"
                                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                        <input
                                            type="url"
                                            value={link.url}
                                            onChange={(e) => updateUsefulLink(index, 'url', e.target.value)}
                                            placeholder="URL"
                                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeUsefulLink(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                            >
                                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}