"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
    ArrowLeft, MapPin, ExternalLink, Moon, Sun, Send, User, MessageSquare
} from 'lucide-react';
import {
    FaGithub, FaLinkedin, FaTwitter, FaGlobe, FaCodepen,
    FaDev, FaMedium, FaStackOverflow, FaGitlab,
    FaBehance, FaDribbble, FaYoutube, FaInstagram
} from 'react-icons/fa';

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

export default function UserPage() {
    const params = useParams();
    const username = params.username as string;
    
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [darkMode, setDarkMode] = useState(false);
    const [showContactForm, setShowContactForm] = useState(false);
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        message: ''
    });

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

    // Theme management
    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedMode !== null) {
            setDarkMode(savedMode === 'true');
        } else if (systemPrefersDark) {
            setDarkMode(true);
        }
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    }, [darkMode]);

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
            {/* Header */}
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                            <span className="font-bold text-xl logo">DevSpace.me</span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            {/* Theme Toggle */}
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    {/* Profile Image */}
                    <div className="relative inline-block mb-8">
                        <div className="relative">
                            <Image
                                src={userData.profileImage || "/user_1.jpeg"}
                                alt={`${userData.fullName}&apos;s profile`}
                                width={200}
                                height={200}
                                className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-2xl"
                                priority
                            />
                            {userData.availableForWork && (
                                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-3 shadow-lg border-4 border-white">
                                    <span className="text-white text-xs font-bold">AVAILABLE</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Name and Title */}
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        {userData.fullName}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                        @{userData.username}
                    </p>
                    {userData.location && (
                        <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400 mb-6">
                            <MapPin className="w-4 h-4" />
                            <span>{userData.location}</span>
                        </div>
                    )}

                    {/* Bio */}
                    <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
                        {userData.bio || 'No bio provided yet.'}
                    </p>

                    {/* Social Links */}
                    {userData.socialHandles && userData.socialHandles.length > 0 && (
                        <div className="flex justify-center space-x-4 mb-8">
                            {userData.socialHandles.map((handle, index) => (
                                <a
                                    key={index}
                                    href={handle.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200 dark:border-gray-700"
                                >
                                    {getSocialIcon(handle.platform)}
                                </a>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Useful Links Section */}
                {userData.usefulLinks && userData.usefulLinks.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mb-16"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
                            Useful Links
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userData.usefulLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <ExternalLink className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {link.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Click to visit
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Projects Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
                        Projects
                    </h2>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No Projects Yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Projects will appear here once they&apos;re added to the profile.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Blog Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
                        Blog Posts
                    </h2>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No Blog Posts Yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Blog posts will appear here once they&apos;re published.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Create Your Own Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-center mb-16"
                >
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-white">
                        <h2 className="text-4xl font-bold mb-4">Create Your Own Portfolio</h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of developers showcasing their work on DevSpace. 
                            Create your professional portfolio in minutes.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/signup"
                                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors font-semibold text-lg"
                            >
                                <User className="w-5 h-5" />
                                <span>Get Started Free</span>
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center space-x-2 px-8 py-4 bg-white/20 hover:bg-white/30 rounded-xl transition-colors font-semibold text-lg border border-white/30"
                            >
                                <span>Learn More</span>
                                <ExternalLink className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Get in Touch Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-center"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Get in Touch
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                            Interested in working together? Have a question? 
                            Feel free to reach out and I&apos;ll get back to you as soon as possible.
                        </p>
                        <button
                            onClick={() => setShowContactForm(true)}
                            className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg"
                        >
                            <MessageSquare className="w-5 h-5" />
                            <span>Send Message</span>
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Floating Create Your Own Button */}
            <div className="fixed bottom-8 right-8 z-40">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                >
                    <Link
                        href="/signup"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <User className="w-4 h-4" />
                        <span>Create Your Own</span>
                    </Link>
                </motion.div>
            </div>

            {/* Contact Form Modal */}
            {showContactForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Get in Touch
                            </h3>
                            <button
                                onClick={() => setShowContactForm(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={contactForm.name}
                                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                            >
                                <Send className="w-4 h-4" />
                                <span>Send Message</span>
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
