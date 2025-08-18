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

interface SocialLink {
    id: string;
    platform: string;
    url: string;
}

interface ProfileData {
    name: string;
    username: string;
    bio: string;
    avatarUrl: string;
    socialLinks: SocialLink[];
    skills: string[];
    location?: string;
    availableForWork: boolean;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<ProfileData>({
        name: "",
        username: "",
        bio: "",
        avatarUrl: "/default-avatar.png",
        socialLinks: [],
        skills: [],
        availableForWork: false
    });
    const [isLoading, setIsLoading] = useState(true);

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

    // Fetch profile data (simulated)
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));

                const mockProfile: ProfileData = {
                    name: "Alex Johnson",
                    username: "alexdev",
                    bio: "Senior Full-Stack Developer | Open Source Contributor | Tech Educator",
                    avatarUrl: "/user_1.jpeg",
                    socialLinks: [
                        { id: "1", platform: "GitHub", url: "https://github.com/alexdev" },
                        { id: "2", platform: "LinkedIn", url: "https://linkedin.com/in/alexdev" },
                        { id: "3", platform: "Twitter", url: "https://twitter.com/alexdev" }
                    ],
                    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
                    location: "San Francisco, CA",
                    availableForWork: true
                };

                setProfile(mockProfile);
            } catch (error) {
                toast.error("Failed to load profile");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-cardDark">
                <Loader2 className="w-12 h-12 animate-spin text-primary/80" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-cardDark rounded-xl shadow-md overflow-hidden"
                >
                    <div className="md:flex">
                        {/* Left side - Profile Image */}
                        <div className="md:w-1/3 p-6 flex flex-col items-center">
                            <div className="relative group">
                                <Image
                                    src={profile.avatarUrl}
                                    alt={`${profile.name}'s profile`}
                                    width={256}
                                    height={256}
                                    className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-indigo-100 dark:border-indigo-900"
                                    priority
                                />
                                <div className="absolute bottom-0 right-0 bg-primary/80 rounded-full p-2">
                                    {profile.availableForWork ? (
                                        <span className="text-background text-xs font-semibold">AVAILABLE</span>
                                    ) : (
                                        <span className="text-background text-xs font-semibold">DEV</span>
                                    )}
                                </div>
                            </div>

                            <Link
                                href="/profile/edit"
                                className="mt-6 px-4 py-2 bg-primary/80 text-background rounded-lg flex items-center gap-2 hover:bg-primary/70 transition-colors"
                            >
                                <FaEdit className="w-4 h-4" />
                                Edit Profile
                            </Link>
                        </div>

                        {/* Right side - Profile Info */}
                        <div className="md:w-2/3 p-6">
                            <div className="flex flex-col space-y-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-primaryText dark:text-background">{profile.name}</h1>
                                    <p className="text-primary font-medium">@{profile.username}</p>

                                    {profile.location && (
                                        <div className="flex items-center mt-2 text-secondaryText/80">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{profile.location}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="prose max-w-none text-secondaryText">
                                    <p>{profile.bio || 'No bio provided yet.'}</p>
                                </div>

                                {/* Social Links */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        Connect
                                    </h3>
                                    <div className="flex flex-wrap gap-4">
                                        {profile.socialLinks?.length > 0 ? (
                                            profile.socialLinks.map((link) => (
                                                <a
                                                    key={link.id}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    {getSocialIcon(link.platform)}
                                                </a>
                                            ))
                                        ) : (
                                            <p className="text-gray-400 dark:text-gray-500">No social links added</p>
                                        )}
                                    </div>
                                </div>

                                {/* Useful Links */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        Useful Links
                                    </h3>
                                    <div className="flex flex-wrap gap-4">
                                        {profile.socialLinks?.length > 0 ? (
                                            profile.socialLinks.map((link) => (
                                                <a
                                                    key={link.id}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    {getSocialIcon(link.platform)}
                                                    <span className="text-sm font-medium">{link.platform}</span>
                                                </a>
                                            ))
                                        ) : (
                                            <p className="text-gray-400 dark:text-gray-500">No social links added</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-[#1b254b]">
                        <div className="flex justify-center items-center">
                            <div className="flex items-center space-x-2 text-sm text-secondaryText/90">
                                <span>Member since 2025</span>
                                {profile.availableForWork && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        Available for work
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