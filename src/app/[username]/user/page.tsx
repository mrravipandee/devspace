"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
// import { toast } from 'sonner';
import { 
    ArrowLeft, MapPin, ExternalLink, Moon, Sun,
    TrendingUp, Users, Code, BookOpen, Eye, Activity, Clock,
} from 'lucide-react';
import {
    FaGithub, FaLinkedin, FaTwitter, FaGlobe, FaCodepen,
    FaDev, FaMedium, FaStackOverflow, FaGitlab,
    FaBehance, FaDribbble, FaYoutube, FaInstagram
} from 'react-icons/fa';
import { useTheme } from '@/context/ThemeContext';

interface SocialHandle {
    platform: string;
    url: string;
}

interface UserData {
    id: string;
    username: string;
    fullName: string;
    bio: string;
    profileImage: string;
    location: string;
    availableForWork: boolean;
    socialHandles: SocialHandle[];
    profileCompleted: boolean;
    createdAt: string;
}

interface DashboardStats {
    visitors: {
        total: number;
        weekly: Array<{ day: string; visitors: number }>;
    };
    projects: {
        total: number;
        active: number;
        completed: number;
        planned: number;
    };
    blogs: {
        total: number;
        recent: number;
        weekly: Array<{ day: string; blogs: number }>;
    };
    engagement: {
        percentage: number;
        trend: string;
    };
    weeklyData: Array<{
        day: string;
        date: string;
        blogs: number;
        projects: number;
        visitors: number;
    }>;
}

interface Activity {
    id: string;
    type: 'blog' | 'project' | 'user';
    title: string;
    description: string;
    timestamp: string;
    author?: string;
    views?: number;
}

export default function UserDashboardPage() {
    const params = useParams();
    const username = params.username as string;
    
    const [userData, setUserData] = useState<UserData | null>(null);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { darkMode, toggleDarkMode } = useTheme();

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
            case 'youtube': return <FaYoutube className="w-5 h-5" />;
            case 'instagram': return <FaInstagram className="w-5 h-5" />;
            default: return <FaGlobe className="w-5 h-5" />;
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'blog': return <BookOpen className="w-4 h-4 text-blue-600" />;
            case 'project': return <Code className="w-4 h-4 text-green-600" />;
            case 'user': return <Users className="w-4 h-4 text-purple-600" />;
            default: return <Activity className="w-4 h-4 text-gray-600" />;
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // Fetch user data
                const userResponse = await fetch(`/api/users/${username}`);
                const userData = await userResponse.json();
                
                if (!userResponse.ok) {
                    if (userResponse.status === 404) {
                        setError('User not found');
                    } else {
                        setError(userData.error || 'Failed to load user profile');
                    }
                    return;
                }
                
                setUserData(userData.user);

                // Fetch dashboard stats
                const statsResponse = await fetch('/api/dashboard/stats');
                const statsData = await statsResponse.json();
                
                if (statsResponse.ok && statsData.success) {
                    setDashboardStats(statsData.data);
                }

                // Fetch recent activity
                const activityResponse = await fetch('/api/dashboard/recent-activity');
                const activityData = await activityResponse.json();
                
                if (activityResponse.ok && activityData.success) {
                    setRecentActivity(activityData.data);
                }
                
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load dashboard data');
            } finally {
                setIsLoading(false);
            }
        };

        if (username) {
            fetchUserData();
        }
    }, [username]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error || !userData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">404 - User Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                        The user <span className="font-semibold">@{username}</span> doesn&apos;t exist.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Go Home</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header */}
            <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/50 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors group">
                            <span className="font-bold text-xl logo">DevSpace.me</span>
                        </Link>
                        <div className="flex items-center space-x-3">
                            <Link
                                href={`/${username}`}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium text-sm"
                            >
                                <span>View Portfolio</span>
                                <ExternalLink className="w-4 h-4" />
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleDarkMode}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* User Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50 mb-8"
                >
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                        {/* Profile Image */}
                        <div className="relative">
                            <Image
                                src={userData.profileImage || "/user_1.jpeg"}
                                alt={`${userData.fullName}'s profile`}
                                width={120}
                                height={120}
                                className="w-30 h-30 rounded-full object-cover border-4 border-white shadow-2xl"
                                priority
                            />
                            {userData.availableForWork && (
                                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-2 shadow-lg border-4 border-white">
                                    <span className="text-white text-xs font-bold">AVAILABLE</span>
                                </div>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {userData.fullName}
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                                @{userData.username}
                            </p>
                            {userData.location && (
                                <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-500 dark:text-gray-400 mb-4">
                                    <MapPin className="w-4 h-4" />
                                    <span>{userData.location}</span>
                                </div>
                            )}
                            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl">
                                {userData.bio || 'No bio provided yet.'}
                            </p>

                            {/* Social Links */}
                            {userData.socialHandles && userData.socialHandles.length > 0 && (
                                <div className="flex justify-center md:justify-start flex-wrap gap-3">
                                    {userData.socialHandles.map((handle, index) => (
                                        <motion.a
                                            key={index}
                                            href={handle.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600"
                                        >
                                            {getSocialIcon(handle.platform)}
                                        </motion.a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Dashboard Stats */}
                {dashboardStats && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    >
                        {/* Total Visitors */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Visitors</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.visitors.total.toLocaleString()}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                    <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </div>

                        {/* Total Projects */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.projects.total}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                                    <Code className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </div>

                        {/* Total Blogs */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Blogs</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.blogs.total}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </div>

                        {/* Engagement */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.engagement.percentage}%</p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Project Stats */}
                {dashboardStats && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
                    >
                        {/* Project Status */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Project Status</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-gray-700 dark:text-gray-300">Completed</span>
                                    </div>
                                    <span className="font-semibold text-gray-900 dark:text-white">{dashboardStats.projects.completed}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <span className="text-gray-700 dark:text-gray-300">Ongoing</span>
                                    </div>
                                    <span className="font-semibold text-gray-900 dark:text-white">{dashboardStats.projects.active}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span className="text-gray-700 dark:text-gray-300">Planned</span>
                                    </div>
                                    <span className="font-semibold text-gray-900 dark:text-white">{dashboardStats.projects.planned}</span>
                                </div>
                            </div>
                        </div>

                        {/* Weekly Activity */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Weekly Activity</h3>
                            <div className="space-y-3">
                                {dashboardStats.weeklyData.slice(-7).map((day, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{day.day}</span>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-1">
                                                <BookOpen className="w-3 h-3 text-blue-600" />
                                                <span className="text-xs text-gray-600 dark:text-gray-400">{day.blogs}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Code className="w-3 h-3 text-green-600" />
                                                <span className="text-xs text-gray-600 dark:text-gray-400">{day.projects}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Recent Activity */}
                {recentActivity.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
                    >
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                                            {activity.title}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                            {activity.description}
                                        </p>
                                        <div className="flex items-center space-x-4 mt-2">
                                            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                                                <Clock className="w-3 h-3" />
                                                <span>{activity.timestamp}</span>
                                            </div>
                                            {activity.views && (
                                                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                                                    <Eye className="w-3 h-3" />
                                                    <span>{activity.views} views</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
