"use client";

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    FaGithub, FaLinkedin, FaTwitter, FaGlobe, FaCodepen,
    FaDev, FaMedium, FaStackOverflow, FaSave, FaTimes, FaGitlab,
    FaEdit, FaUserCircle, FaBehance, FaDribbble
} from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { getUserProfile } from '@/lib/apiClient';

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

export default function ProfilePage() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getSocialIcon = (platform: string) => {
        const platformLower = platform.toLowerCase();
        switch (platformLower) {
            case 'github': return <FaGithub className="w-5 h-5" />;
            case 'linkedin': return <FaLinkedin className="w-5 h-5" />;
            case 'twitter': return <FaTwitter className="w-5 h-5" />;
            case 'website': return <FaGlobe className="w-5 h-5" />;
            case 'codepen': return <FaCodepen className="w-5 h-5" />;
            case 'dev': return <FaDev className="w-5 h-5" />;
            case 'medium': return <FaMedium className="w-5 h-5" />;
            case 'stackoverflow': return <FaStackOverflow className="w-5 h-5" />;
            case 'gitlab': return <FaGitlab className="w-5 h-5" />;
            case 'behance': return <FaBehance className="w-5 h-5" />;
            case 'dribbble': return <FaDribbble className="w-5 h-5" />;
            default: return <FaGlobe className="w-5 h-5" />;
        }
    };

    // Fetch profile data from API
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const response = await getUserProfile();
                setProfile(response.user);
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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="text-center">
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
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaUserCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">No profile data found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Completion Banner */}
                {!profile.profileCompleted && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6 rounded-2xl shadow-xl border border-blue-500/20"
                    >
                        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <FaUserCircle className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl">Complete Your Profile</h3>
                                    <p className="text-blue-100 text-sm mt-1">Add your bio, location, and social links to unlock all DevSpace features</p>
                                </div>
                            </div>
                            <Link
                                href="/profile/edit"
                                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 backdrop-blur-sm border border-white/30 hover:border-white/50"
                            >
                                <FaEdit className="w-4 h-4" />
                                Complete Profile
                            </Link>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
                >
                    {/* Header Section */}
                    <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <div className="flex flex-col lg:flex-row items-end lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                                <div className="relative">
                                    <Image
                                        src={profile.profileImage || "/user_1.jpeg"}
                                        alt={`${profile.fullName}'s profile`}
                                        width={120}
                                        height={120}
                                        className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl object-cover border-4 border-white/20 shadow-2xl"
                                        priority
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-2 shadow-lg border-2 border-white">
                                        {profile.availableForWork ? (
                                            <span className="text-white text-xs font-bold">AVAILABLE</span>
                                        ) : (
                                            <span className="text-white text-xs font-bold">DEV</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 text-white">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h1 className="text-3xl lg:text-4xl font-bold">{profile.fullName}</h1>
                                        {profile.profileCompleted && (
                                            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm border border-white/30">
                                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                                Complete
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-blue-100 text-lg font-medium">@{profile.username}</p>
                                    {profile.location && (
                                        <div className="flex items-center mt-2 text-blue-100">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="font-medium">{profile.location}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={`/${profile.username}`}
                                        target="_blank"
                                        className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 backdrop-blur-sm border border-white/30 hover:border-white/50"
                                    >
                                        <FaGlobe className="w-4 h-4" />
                                        View Public Profile
                                    </Link>
                                    <Link
                                        href="/profile/edit"
                                        className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 backdrop-blur-sm border border-white/30 hover:border-white/50"
                                    >
                                        <FaEdit className="w-4 h-4" />
                                        Edit Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* About Section */}
                                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl border border-white/20 dark:border-gray-700/50">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Bio</h3>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                                        {profile.bio || 'No bio provided yet. Add a bio to tell others about yourself and your work.'}
                                    </p>
                                </div>

                                {/* Social Links */}
                                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl border border-white/20 dark:border-gray-700/50">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Connect</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {profile.socialHandles?.length > 0 ? (
                                            profile.socialHandles.map((handle, index) => (
                                                <a
                                                    key={index}
                                                    href={handle.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex items-center space-x-4 p-4 rounded-xl hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                                                >
                                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        {getSocialIcon(handle.platform)}
                                                    </div>
                                                    <span className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{handle.platform}</span>
                                                </a>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-12">
                                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                    <FaGlobe className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-400 font-medium">No social links added yet</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Add your social media profiles to connect with others</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Useful Links */}
                                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl border border-white/20 dark:border-gray-700/50">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Useful Links</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {profile.usefulLinks?.length > 0 ? (
                                            profile.usefulLinks.map((link, index) => (
                                                <a
                                                    key={index}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex items-center space-x-4 p-4 rounded-xl hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                                                >
                                                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <FaGlobe className="w-5 h-5 text-white" />
                                                    </div>
                                                    <span className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{link.title}</span>
                                                </a>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-12">
                                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                    <FaGlobe className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-400 font-medium">No useful links added yet</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Add links to your projects, portfolio, or other resources</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Stats Card */}
                                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20 dark:border-gray-700/50">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Stats</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Social Links</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{profile.socialHandles?.length || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Useful Links</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{profile.usefulLinks?.length || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Profile Status</span>
                                            <span className={`font-semibold ${profile.profileCompleted ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                                {profile.profileCompleted ? 'Complete' : 'Incomplete'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Member Since */}
                                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20 dark:border-gray-700/50">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Member Since</h4>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{new Date(profile.createdAt).getFullYear()}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {new Date(profile.createdAt).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-white/20 dark:border-gray-700/50 px-8 py-6 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm">
                        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Member since {new Date(profile.createdAt).getFullYear()}
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                {profile.availableForWork && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-800">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        Available for work
                                    </span>
                                )}
                                {profile.profileCompleted && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                        Profile Complete
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}