"use client";

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import {
    FaGithub, FaLinkedin, FaTwitter, FaGlobe, FaCodepen,
    FaDev, FaMedium, FaStackOverflow, FaSave, FaTimes, FaGitlab,
    FaEdit, FaUserCircle, FaBehance, FaDribbble
} from 'react-icons/fa';
import { Image as ImageIcon, PlusCircle, Trash2, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

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

const socialPlatforms = [
    "GitHub", "LinkedIn", "Twitter", "Website",
    "Codepen", "Dev", "Medium", "StackOverflow", "GitLab",
    "Behance", "Dribbble", "Instagram", "YouTube", "Twitch"
];

const skillSuggestions = [
    "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
    "Python", "Django", "Flask", "HTML", "CSS", "Tailwind CSS",
    "GraphQL", "REST API", "Docker", "AWS", "PostgreSQL"
];

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
    const [isEditing, setIsEditing] = useState(false);
    const [editProfile, setEditProfile] = useState<ProfileData>({ ...profile });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [newSocialLink, setNewSocialLink] = useState<Omit<SocialLink, 'id'>>({ platform: '', url: '' });
    const [newSkill, setNewSkill] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [skillSuggestionsVisible, setSkillSuggestionsVisible] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

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
                setEditProfile(mockProfile);
                setImagePreview(mockProfile.avatarUrl);
            } catch (error) {
                toast.error("Failed to load profile");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

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

    const handleEdit = () => {
        setEditProfile(profile);
        setImagePreview(profile.avatarUrl);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setImagePreview(null);
        toast.info("Changes discarded");
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const updatedProfile = {
                ...editProfile,
                avatarUrl: imagePreview || '/user_1.jpeg',
                socialLinks: editProfile.socialLinks.filter(link => link.platform && link.url)
            };

            setProfile(updatedProfile);
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size should be less than 2MB");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                toast.success("Image uploaded successfully");
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditProfile(prev => ({ ...prev, [name]: value }));
    };

    const addSocialLink = () => {
        if (newSocialLink.platform && newSocialLink.url) {
            setEditProfile(prev => ({
                ...prev,
                socialLinks: [...prev.socialLinks, { ...newSocialLink, id: Date.now().toString() }]
            }));
            setNewSocialLink({ platform: '', url: '' });
            toast.success("Social link added");
        }
    };

    const removeSocialLink = (id: string) => {
        setEditProfile(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.filter(link => link.id !== id)
        }));
        toast.info("Social link removed");
    };

    const addSkill = () => {
        if (newSkill && !editProfile.skills.includes(newSkill)) {
            setEditProfile(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill]
            }));
            setNewSkill("");
            toast.success("Skill added");
        }
    };

    const removeSkill = (skill: string) => {
        setEditProfile(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill)
        }));
        toast.info("Skill removed");
    };

    const handleSkillKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    };

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
                <AnimatePresence mode="wait">
                    {!isEditing ? (
                        // View Mode
                        <motion.div
                            key="view"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
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

                                    <button
                                        onClick={handleEdit}
                                        className="mt-6 px-4 py-2 bg-primary/80 text-background rounded-lg flex items-center gap-2 hover:bg-primary/70 transition-colors"
                                    >
                                        <FaEdit className="w-4 h-4" />
                                        Edit Profile
                                    </button>
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
                                                            {/* <span className="text-sm font-medium">{link.platform}</span> */}
                                                        </a>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-400 dark:text-gray-500">No social links added</p>
                                                )}
                                            </div>
                                        </div>
                                        {/* useful links */}
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
                    ) : (
                        // Edit Mode
                        <motion.div
                            key="edit"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white dark:bg-cardDark rounded-xl shadow-md overflow-hidden"
                        >
                            <form ref={formRef} onSubmit={handleSave}>
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                                aria-label="Cancel editing"
                                                disabled={isSaving}
                                            >
                                                <FaTimes className="w-5 h-5" />
                                            </button>
                                            <button
                                                type="submit"
                                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                                aria-label="Save profile"
                                                disabled={isSaving}
                                            >
                                                {isSaving ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <FaSave className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="md:flex gap-8">
                                        {/* Left side - Profile Image */}
                                        <div className="md:w-1/3 mb-6 md:mb-0">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Profile Image
                                            </label>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageChange}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            <div
                                                onClick={triggerFileInput}
                                                className={`relative h-48 w-48 mx-auto rounded-full border-4 border-dashed flex flex-col items-center justify-center cursor-pointer ${imagePreview
                                                        ? 'border-transparent'
                                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                                    }`}
                                            >
                                                {imagePreview ? (
                                                    <>
                                                        <Image
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            width={192}
                                                            height={192}
                                                            className="object-cover rounded-full w-full h-full"
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                            <ImageIcon className="w-8 h-8 text-white" />
                                                            <span className="text-white text-sm ml-1">Change</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-center p-4">
                                                        <FaUserCircle className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Click to upload</p>
                                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Max 2MB</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right side - Profile Info */}
                                        <div className="md:w-2/3 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Full Name*
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={editProfile.name}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-2.5 dark:bg-[#0b1437] dark:text-secondaryText rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryText focus:border-transparent"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Username*
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="username"
                                                        value={editProfile.username}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-2.5 dark:bg-[#0b1437] dark:text-secondaryText rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryText focus:border-transparent"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Location
                                                </label>
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={editProfile.location || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 dark:bg-[#0b1437] dark:text-secondaryText rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryText focus:border-transparent"
                                                    placeholder="City, Country"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Bio
                                                </label>
                                                <textarea
                                                    name="bio"
                                                    value={editProfile.bio}
                                                    onChange={handleInputChange}
                                                    rows={3}
                                                    className="w-full px-4 py-2.5 dark:bg-[#0b1437] dark:text-secondaryText rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryText focus:border-transparent"
                                                    placeholder="Tell us about yourself..."
                                                />
                                            </div>

                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="availableForWork"
                                                    checked={editProfile.availableForWork}
                                                    onChange={(e) => setEditProfile({ ...editProfile, availableForWork: e.target.checked })}
                                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                                                />
                                                <label htmlFor="availableForWork" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                                    Available for work
                                                </label>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Social Links
                                                </label>
                                                <div className="space-y-3">
                                                    {editProfile.socialLinks.map((link) => (
                                                        <div key={link.id} className="flex gap-2 items-center">
                                                            <select
                                                                value={link.platform}
                                                                onChange={(e) => {
                                                                    const updatedLinks = editProfile.socialLinks.map(l =>
                                                                        l.id === link.id ? { ...l, platform: e.target.value } : l
                                                                    );
                                                                    setEditProfile({ ...editProfile, socialLinks: updatedLinks });
                                                                }}
                                                                className="flex-1 px-4 py-2.5 dark:bg-[#0b1437] dark:text-secondaryText rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryText focus:border-transparent"
                                                            >
                                                                {socialPlatforms.map(platform => (
                                                                    <option key={platform} value={platform}>{platform}</option>
                                                                ))}
                                                            </select>
                                                            <input
                                                                type="url"
                                                                value={link.url}
                                                                onChange={(e) => {
                                                                    const updatedLinks = editProfile.socialLinks.map(l =>
                                                                        l.id === link.id ? { ...l, url: e.target.value } : l
                                                                    );
                                                                    setEditProfile({ ...editProfile, socialLinks: updatedLinks });
                                                                }}
                                                                className="flex-1 px-4 py-2.5 dark:bg-[#0b1437] dark:text-secondaryText rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryText focus:border-transparent"
                                                                placeholder="https://example.com"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeSocialLink(link.id)}
                                                                className="text-primary hover:text-primary/90 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                aria-label="Remove social link"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}

                                                    <div className="flex gap-2 items-center">
                                                        <select
                                                            value={newSocialLink.platform}
                                                            onChange={(e) => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
                                                            className="flex-1 px-4 py-2.5 dark:bg-[#0b1437] dark:text-secondaryText rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryText focus:border-transparent"
                                                        >
                                                            <option value="">Select platform</option>
                                                            {socialPlatforms.map(platform => (
                                                                <option key={platform} value={platform}>{platform}</option>
                                                            ))}
                                                        </select>
                                                        <input
                                                            type="url"
                                                            value={newSocialLink.url}
                                                            onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                                                            className="flex-1 px-4 py-2.5 dark:bg-[#0b1437] dark:text-secondaryText rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryText focus:border-transparent"
                                                            placeholder="https://example.com"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={addSocialLink}
                                                            disabled={!newSocialLink.platform || !newSocialLink.url}
                                                            className="text-green-500 hover:text-green-700 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            aria-label="Add social link"
                                                        >
                                                            <PlusCircle className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Useful Links
                                                </label>
                                                <div className="space-y-3">
                                                    {editProfile.socialLinks.map((link) => (
                                                        <div key={link.id} className="flex gap-2 items-center">
                                                            <select
                                                                value={link.platform}
                                                                onChange={(e) => {
                                                                    const updatedLinks = editProfile.socialLinks.map(l =>
                                                                        l.id === link.id ? { ...l, platform: e.target.value } : l
                                                                    );
                                                                    setEditProfile({ ...editProfile, socialLinks: updatedLinks });
                                                                }}
                                                                className="flex-1 px-4 py-2.5 dark:bg-[#0b1437] dark:text-secondaryText rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryText focus:border-transparent"
                                                            >
                                                                {socialPlatforms.map(platform => (
                                                                    <option key={platform} value={platform}>{platform}</option>
                                                                ))}
                                                            </select>
                                                            <input
                                                                type="url"
                                                                value={link.url}
                                                                onChange={(e) => {
                                                                    const updatedLinks = editProfile.socialLinks.map(l =>
                                                                        l.id === link.id ? { ...l, url: e.target.value } : l
                                                                    );
                                                                    setEditProfile({ ...editProfile, socialLinks: updatedLinks });
                                                                }}
                                                                className="flex-1 px-4 py-2.5 dark:bg-[#0b1437] dark:text-secondaryText rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryText focus:border-transparent"
                                                                placeholder="https://example.com"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeSocialLink(link.id)}
                                                                className="text-primary hover:text-primary/90 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                aria-label="Remove social link"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}

                                                    <div className="flex gap-2 items-center">
                                                        <select
                                                            value={newSocialLink.platform}
                                                            onChange={(e) => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
                                                            className="flex-1 px-4 py-2.5 dark:bg-[#0b1437] dark:text-secondaryText rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryText focus:border-transparent"
                                                        >
                                                            <option value="">Select platform</option>
                                                            {socialPlatforms.map(platform => (
                                                                <option key={platform} value={platform}>{platform}</option>
                                                            ))}
                                                        </select>
                                                        <input
                                                            type="url"
                                                            value={newSocialLink.url}
                                                            onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                                                            className="flex-1 px-4 py-2.5 dark:bg-[#0b1437] dark:text-secondaryText rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryText focus:border-transparent"
                                                            placeholder="https://example.com"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={addSocialLink}
                                                            disabled={!newSocialLink.platform || !newSocialLink.url}
                                                            className="text-green-500 hover:text-green-700 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            aria-label="Add social link"
                                                        >
                                                            <PlusCircle className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="px-5 py-2.5 border border-background dark:border-secondaryText rounded-lg text-secondaryText dark:text-background/80 hover:bg-background/80 dark:hover:bg-secondaryText/80 transition-colors"
                                            disabled={isSaving}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
                                            disabled={isSaving}
                                        >
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <FaSave className="w-4 h-4" />
                                                    Save Profile
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}