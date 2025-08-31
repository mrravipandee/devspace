"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
    ArrowLeft, MapPin, ExternalLink, Moon, Sun, Send, User, MessageSquare,
    Share2, Copy, Check, Mail, Phone, Calendar, Award, Code, BookOpen,
    Globe, Github, Linkedin, Twitter, Instagram, Youtube, Heart
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
}

interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    tech: string[];
    tags: string[];
    status: 'Planned' | 'Ongoing' | 'Completed';
    liveLink: string;
    sourceCode: string;
    projectLogo: string;
    techLogos: string[];
}

interface Blog {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    featureImage: string;
    tags: string[];
    createdAt: string;
}

export default function UserPage() {
    const params = useParams();
    const username = params.username as string;
    
    const [userData, setUserData] = useState<UserData | null>(null);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showContactForm, setShowContactForm] = useState(false);
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [copied, setCopied] = useState(false);
    const { darkMode, toggleDarkMode, currentTheme } = useTheme();

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

        const fetchAchievements = async () => {
            try {
                const response = await fetch(`/api/${username}/achievements`);
                const data = await response.json();
                
                if (response.ok && data.success) {
                    setAchievements(data.data);
                }
            } catch (error) {
                console.error('Error fetching achievements:', error);
            }
        };

        const fetchProjects = async () => {
            try {
                const response = await fetch(`/api/${username}/projects`);
                const data = await response.json();
                
                if (response.ok && data.success) {
                    setProjects(data.data);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        const fetchBlogs = async () => {
            try {
                const response = await fetch(`/api/${username}/blog`);
                const data = await response.json();
                
                if (response.ok && data.success) {
                    setBlogs(data.data);
                }
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        if (username) {
            fetchUserData();
            fetchAchievements();
            fetchProjects();
            fetchBlogs();
        }
    }, [username]);

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactForm),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                toast.success('Message sent successfully! Redirecting to dashboard...');
                setContactForm({ name: '', email: '', message: '' });
                setShowContactForm(false);
                
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    window.location.href = '/home';
                }, 2000);
            } else {
                toast.error(data.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Loading portfolio...</p>
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">404 - Portfolio Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                        The portfolio for <span className="font-semibold">@{username}</span> doesn&apos;t exist.
                    </p>
                    <div className="space-y-3">
                        <Link
                            href="/"
                            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Go Home</span>
                        </Link>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            <p>Want to create your own portfolio?</p>
                            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                                Sign up for DevSpace
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Enhanced Header */}
            <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/50 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors group">
                            <span className="font-bold text-xl logo">DevSpace.me</span>
                        </Link>
                        <div className="flex items-center space-x-3">
                            {/* Share Profile Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleShareProfile}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                                <span>{copied ? 'Copied!' : 'Share Profile'}</span>
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Enhanced User Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    {/* Profile Image with Glassmorphism */}
                    <div className="relative inline-block mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-30 scale-110"></div>
                            <Image
                                src={userData.profileImage || "/user_1.jpeg"}
                                alt={`${userData.fullName}'s profile`}
                                width={200}
                                height={200}
                                className="relative w-48 h-48 rounded-full object-cover border-4 border-white/50 shadow-2xl backdrop-blur-sm"
                                priority
                            />
                            {userData.availableForWork && (
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                    className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-3 shadow-lg border-4 border-white"
                                >
                                    <span className="text-white text-xs font-bold">AVAILABLE</span>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Name and Title with Enhanced Typography */}
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent mb-4"
                    >
                        {userData.fullName}
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-xl text-gray-600 dark:text-gray-400 mb-2 font-medium"
                    >
                        @{userData.username}
                    </motion.p>
                    {userData.location && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400 mb-6"
                        >
                            <MapPin className="w-4 h-4" />
                            <span>{userData.location}</span>
                        </motion.div>
                    )}

                    {/* Bio with Better Styling */}
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8"
                    >
                        {userData.bio || 'No bio provided yet.'}
                    </motion.p>

                    {/* Enhanced Social Links */}
                    {userData.socialHandles && userData.socialHandles.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="flex justify-center flex-wrap gap-4 mb-8"
                        >
                            {userData.socialHandles.map((handle, index) => (
                                <motion.a
                                    key={index}
                                    href={handle.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-12 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600"
                                >
                                    {getSocialIcon(handle.platform)}
                                </motion.a>
                            ))}
                        </motion.div>
                    )}
                </motion.div>

                {/* Enhanced Useful Links Section */}
                {userData.usefulLinks && userData.usefulLinks.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mb-16"
                    >
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12"
                        >
                            Useful Links
                        </motion.h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userData.usefulLinks.map((link, index) => (
                                <motion.a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                            <ExternalLink className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {link.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Click to visit
                                            </p>
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Enhanced Projects Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-16"
                >
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12"
                    >
                        Featured Projects
                    </motion.h2>
                    
                    {projects.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Large Project Card (Left) */}
                            {projects[0] && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="lg:col-span-2"
                                >
                                    <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 h-full">
                                        {projects[0].image && (
                                            <div className="relative w-full h-64 mb-6 rounded-2xl overflow-hidden">
                                                <Image
                                                    src={projects[0].image}
                                                    alt={projects[0].title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                                <div className="absolute top-4 right-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        projects[0].status === 'Completed' ? 'bg-green-500 text-white' :
                                                        projects[0].status === 'Ongoing' ? 'bg-yellow-500 text-white' :
                                                        'bg-blue-500 text-white'
                                                    }`}>
                                                        {projects[0].status}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {projects[0].title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                            {projects[0].description}
                                        </p>
                                        {projects[0].tech && projects[0].tech.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {projects[0].tech.slice(0, 4).map((tech, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-sm rounded-full"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex gap-3 flex-wrap">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                                            >
                                                <span>View Details</span>
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                                            >
                                                <span>Edit</span>
                                            </motion.button>
                                        </div>
                                        <div className="flex gap-3 mt-3">
                                            {projects[0].liveLink && (
                                                <motion.a
                                                    href={projects[0].liveLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                                                >
                                                    <Globe className="w-4 h-4" />
                                                    <span>Live Demo</span>
                                                    <ExternalLink className="w-3 h-3" />
                                                </motion.a>
                                            )}
                                            {projects[0].sourceCode && (
                                                <motion.a
                                                    href={projects[0].sourceCode}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                                                >
                                                    <Github className="w-4 h-4" />
                                                    <span>Source Code</span>
                                                    <ExternalLink className="w-3 h-3" />
                                                </motion.a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Smaller Project Cards (Right) */}
                            <div className="space-y-6">
                                {projects.slice(1, 3).map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                                        className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600"
                                    >
                                        {project.image && (
                                            <div className="relative w-full h-32 mb-4 rounded-xl overflow-hidden">
                                                <Image
                                                    src={project.image}
                                                    alt={project.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute top-2 right-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        project.status === 'Completed' ? 'bg-green-500 text-white' :
                                                        project.status === 'Ongoing' ? 'bg-yellow-500 text-white' :
                                                        'bg-blue-500 text-white'
                                                    }`}>
                                                        {project.status}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                                            {project.description}
                                        </p>
                                        <div className="flex gap-2">
                                            {project.liveLink && (
                                                <motion.a
                                                    href={project.liveLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg"
                                                >
                                                    <Globe className="w-3 h-3" />
                                                    <span>Live</span>
                                                    <ExternalLink className="w-2 h-2" />
                                                </motion.a>
                                            )}
                                            {project.sourceCode && (
                                                <motion.a
                                                    href={project.sourceCode}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg"
                                                >
                                                    <Github className="w-3 h-3" />
                                                    <span>Code</span>
                                                    <ExternalLink className="w-2 h-2" />
                                                </motion.a>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                        <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Code className="w-10 h-10 text-white" />
                            </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                No Projects Yet
                            </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                Projects will appear here once they&apos;re added to the profile.
                            </p>
                        </div>
                    </div>
                    )}
                </motion.div>

                {/* Enhanced Blog Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mb-16"
                >
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12"
                    >
                        Latest Blog Posts
                    </motion.h2>
                    
                    {blogs.length > 0 ? (
                        <div className="relative">
                            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                                {blogs.map((blog, index) => (
                                    <motion.div
                                        key={blog.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                                        className="flex-shrink-0 w-80 group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600"
                                    >
                                        {blog.featureImage && (
                                            <div className="relative w-full h-48 rounded-t-2xl overflow-hidden">
                                                <Image
                                                    src={blog.featureImage}
                                                    alt={blog.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <BookOpen className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(blog.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                                {blog.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                                                {blog.excerpt}
                                            </p>
                                            {blog.tags && blog.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {blog.tags.slice(0, 3).map((tag, tagIndex) => (
                                                        <span
                                                            key={tagIndex}
                                                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded-full"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <button className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors">
                                                <span>Read More</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                        <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <BookOpen className="w-10 h-10 text-white" />
                            </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                No Blog Posts Yet
                            </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                Blog posts will appear here once they&apos;re published.
                            </p>
                        </div>
                    </div>
                    )}
                </motion.div>

                {/* Enhanced Achievements Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mb-16"
                >
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12"
                    >
                        Achievements & Awards
                    </motion.h2>
                    
                    {achievements.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {achievements.map((achievement, index) => (
                                <motion.div
                                    key={achievement.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600"
                                >
                                    {achievement.image && (
                                        <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden">
                                            <Image
                                                src={achievement.image}
                                                alt={achievement.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            achievement.type === 'certification' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                            achievement.type === 'hackathon' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                                            achievement.type === 'internship' ? 'bg-green-100 dark:bg-green-900/30' :
                                            achievement.type === 'project' ? 'bg-purple-100 dark:bg-purple-900/30' :
                                            'bg-red-100 dark:bg-red-900/30'
                                        }`}>
                                            <Award className={`w-5 h-5 ${
                                                achievement.type === 'certification' ? 'text-blue-600 dark:text-blue-400' :
                                                achievement.type === 'hackathon' ? 'text-yellow-600 dark:text-yellow-400' :
                                                achievement.type === 'internship' ? 'text-green-600 dark:text-green-400' :
                                                achievement.type === 'project' ? 'text-purple-600 dark:text-purple-400' :
                                                'text-red-600 dark:text-red-400'
                                            }`} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {achievement.title}
                                        </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                <Calendar className="w-3 h-3" />
                                                <span>{new Date(achievement.date).toLocaleDateString()}</span>
                                    </div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">
                                        {achievement.issuer}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                                        {achievement.description}
                                    </p>
                                    {achievement.skills && achievement.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {achievement.skills.slice(0, 3).map((skill, skillIndex) => (
                                                <span
                                                    key={skillIndex}
                                                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded-full"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {achievement.skills.length > 3 && (
                                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                                    +{achievement.skills.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    <a
                                        href={achievement.verificationUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                                    >
                                        Verify this achievement
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Award className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                    No Achievements Yet
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                    Achievements will appear here once they&apos;re added to the profile.
                                </p>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Enhanced Contact Form Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mb-16"
                >
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12"
                    >
                        Get in Touch
                    </motion.h2>
                    
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Let&apos;s Connect
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Interested in working together? Have a question? Feel free to reach out!
                                </p>
                            </div>
                            
                            <form onSubmit={handleContactSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={contactForm.name}
                                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                                        placeholder="Your name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={contactForm.email}
                                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                                        placeholder="your.email@example.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        value={contactForm.message}
                                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-none"
                                        placeholder="Tell me about your project or just say hello!"
                                        required
                                    />
                                </div>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 shadow-lg"
                                >
                                    <Send className="w-5 h-5" />
                                    <span>Send Message</span>
                                </motion.button>
                            </form>
                        </div>
                    </div>
                </motion.div>

                {/* Create Your Own CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10">
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.6 }}
                                className="text-4xl font-bold mb-4"
                            >
                                Create Your Own Portfolio
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                                className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
                            >
                            Join thousands of developers showcasing their work on DevSpace. 
                            Create your professional portfolio in minutes.
                            </motion.p>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9, duration: 0.6 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                            >
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="/signup"
                                        className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors font-semibold text-lg shadow-lg"
                            >
                                <User className="w-5 h-5" />
                                <span>Get Started Free</span>
                            </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="/"
                                className="inline-flex items-center space-x-2 px-8 py-4 bg-white/20 hover:bg-white/30 rounded-xl transition-colors font-semibold text-lg border border-white/30"
                            >
                                <span>Learn More</span>
                                <ExternalLink className="w-5 h-5" />
                            </Link>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Enhanced Floating Create Your Own Button */}
            <div className="fixed bottom-8 right-8 z-40">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link
                        href="/signup"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20"
                    >
                        <User className="w-4 h-4" />
                        <span>Create Your Own</span>
                    </Link>
                </motion.div>
            </div>

            {/* Enhanced Footer */}
            <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span className="text-sm">Made with love by DevSpace</span>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Home
                            </Link>
                            <Link href="/signup" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Create Portfolio
                            </Link>
                            <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Contact
                            </Link>
                            </div>
                            </div>
                    <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            © 2024 DevSpace.me. All rights reserved. | Built with Next.js & Tailwind CSS
                        </p>
                            </div>
                </div>
            </footer>


        </div>
    );
}
