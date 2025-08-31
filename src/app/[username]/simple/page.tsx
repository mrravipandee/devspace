"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
    ArrowLeft, MapPin, ExternalLink, Moon, Sun, User, Heart, Globe
} from 'lucide-react';
import {
    FaGithub, FaLinkedin, FaTwitter, FaGlobe, FaCodepen,
    FaDev, FaMedium, FaStackOverflow, FaGitlab,
    FaBehance, FaDribbble, FaYoutube, FaInstagram, FaSpotify, FaTelegram, FaDiscord
} from 'react-icons/fa';
import { useTheme } from '@/context/ThemeContext';

interface SocialHandle {
    platform: string;
    url: string;
}

interface UsefulLink {
    title: string;
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
    usefulLinks: UsefulLink[];
    profileCompleted: boolean;
    createdAt: string;
}

export default function SimpleUserPage() {
    const params = useParams();
    const username = params.username as string;
    
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
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
            case 'spotify': return <FaSpotify className="w-5 h-5" />;
            case 'telegram': return <FaTelegram className="w-5 h-5" />;
            case 'discord': return <FaDiscord className="w-5 h-5" />;
            default: return <FaGlobe className="w-5 h-5" />;
        }
    };

    // Share profile functionality
    const handleShareProfile = async () => {
        const profileUrl = `${window.location.origin}/${username}`;
        try {
            await navigator.clipboard.writeText(profileUrl);
            setCopied(true);
            toast.success('Profile link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy link');
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const response = await fetch(`/api/users/${username}`);
                const data = await response.json();
                
                if (!response.ok) {
                    if (response.status === 404) {
                        setError('User not found');
                    } else {
                        setError(data.error || 'Failed to load user profile');
                    }
                    return;
                }
                
                setUserData(data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to load user profile');
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
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Loading portfolio...</p>
                </div>
            </div>
        );
    }

    if (error || !userData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">404 - Portfolio Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                        The portfolio for <span className="font-semibold">@{username}</span> doesn&apos;t exist.
                    </p>
                    <div className="space-y-3">
                        <Link
                            href="/"
                            className="inline-flex items-center space-x-2 px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Go Home</span>
                        </Link>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            <p>Want to create your own portfolio?</p>
                            <Link href="/signup" className="text-pink-600 hover:text-pink-700 font-medium">
                                Sign up for DevSpace
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Simple Header */}
            <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/50 sticky top-0 z-50 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors">
                            <span className="font-bold text-xl logo">DevSpace.me</span>
                        </Link>
                        <div className="flex items-center space-x-3">
                            {/* Share Profile Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleShareProfile}
                                className="flex items-center space-x-2 px-3 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors font-medium text-sm"
                            >
                                <span>{copied ? 'Copied!' : 'Share'}</span>
                            </motion.button>
                            {/* Theme Toggle */}
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

            <div className="max-w-md mx-auto px-4 py-12">
                {/* User Section - Link-in-Bio Style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    {/* Profile Image */}
                    <div className="relative inline-block mb-6">
                        <Image
                            src={userData.profileImage || "/user_1.jpeg"}
                            alt={`${userData.fullName}'s profile`}
                            width={120}
                            height={120}
                            className="w-30 h-30 rounded-full object-cover border-4 border-white shadow-2xl"
                            priority
                        />
                        {userData.availableForWork && (
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                className="absolute -bottom-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-2 shadow-lg border-2 border-white"
                            >
                                <span className="text-white text-xs font-bold">AVAILABLE</span>
                            </motion.div>
                        )}
                    </div>

                    {/* Name and Title */}
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                    >
                        {userData.fullName}
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-sm text-gray-600 dark:text-gray-400 mb-4"
                    >
                        {userData.bio || 'Front End Developer || Contribution Purpose-Driven Websites'}
                    </motion.p>

                    {/* Social Links */}
                    {userData.socialHandles && userData.socialHandles.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="flex justify-center flex-wrap gap-3 mb-8"
                        >
                            {userData.socialHandles.map((handle, index) => (
                                <motion.a
                                    key={index}
                                    href={handle.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-pink-300 dark:hover:border-pink-600"
                                >
                                    {getSocialIcon(handle.platform)}
                                </motion.a>
                            ))}
                        </motion.div>
                    )}
                </motion.div>

                {/* Useful Links Section - Link-in-Bio Style */}
                {userData.usefulLinks && userData.usefulLinks.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mb-12"
                    >
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="text-lg font-bold text-gray-900 dark:text-white text-center mb-6"
                        >
                            Connect with me!
                        </motion.h2>
                        <div className="space-y-4">
                            {userData.usefulLinks.map((link, index) => (
                                <motion.a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                                    whileHover={{ y: -2, scale: 1.02 }}
                                    className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-pink-300 dark:hover:border-pink-600 flex items-center space-x-4"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                        {link.title.toLowerCase().includes('youtube') ? (
                                            <FaYoutube className="w-6 h-6 text-white" />
                                        ) : link.title.toLowerCase().includes('portfolio') ? (
                                            <Image
                                                src={userData.profileImage || "/user_1.jpeg"}
                                                alt="Portfolio"
                                                width={24}
                                                height={24}
                                                className="w-6 h-6 rounded-full object-cover"
                                            />
                                        ) : (
                                            <ExternalLink className="w-6 h-6 text-white" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                                            {link.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Click to visit
                                        </p>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Projects Section - Simple Version */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mb-8"
                >
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="text-lg font-bold text-gray-900 dark:text-white text-center mb-4"
                    >
                        Featured Projects
                    </motion.h2>
                    
                    {/* Sample Project Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50 mb-4"
                    >
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">DP</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                    DevSpace Portfolio
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Full-stack portfolio platform
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                            A modern portfolio platform for developers to showcase their work, projects, and achievements.
                        </p>
                        <div className="flex gap-2">
                            <motion.a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white rounded-lg transition-all duration-300 text-xs font-medium shadow-md hover:shadow-lg"
                            >
                                <Globe className="w-3 h-3" />
                                <span>Live</span>
                                <ExternalLink className="w-2 h-2" />
                            </motion.a>
                            <motion.a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-lg transition-all duration-300 text-xs font-medium shadow-md hover:shadow-lg"
                            >
                                <Github className="w-3 h-3" />
                                <span>Code</span>
                                <ExternalLink className="w-2 h-2" />
                            </motion.a>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Create Your Own CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center"
                >
                    <div className="bg-gradient-to-r from-pink-600 via-orange-600 to-yellow-600 rounded-2xl p-8 text-white">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.6 }}
                            className="text-2xl font-bold mb-3"
                        >
                            Create Your Own
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0, duration: 0.6 }}
                            className="text-pink-100 mb-6 text-sm"
                        >
                            Join thousands of developers showcasing their work on DevSpace.
                        </motion.p>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1, duration: 0.6 }}
                        >
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/signup"
                                    className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-pink-600 rounded-xl hover:bg-gray-100 transition-colors font-semibold shadow-lg"
                                >
                                    <User className="w-4 h-4" />
                                    <span>Get Started Free</span>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Simple Footer */}
            <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 mt-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span className="text-sm">Made with love by DevSpace</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            © 2024 DevSpace.me. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
