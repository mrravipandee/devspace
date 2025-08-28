"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
    Code, 
    Copy, 
    BookOpen,
    Terminal,
    Globe,
    Zap,
    ExternalLink,
    BarChart3,
    Users,
    Eye,
    TrendingUp,
    Github,
    Link,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { getUserProfile } from '@/lib/apiClient';

interface ApiEndpoint {
    name: string;
    path: string;
    method: string;
    description: string;
    example: string;
    response: string;
    category: 'profile' | 'projects' | 'blog' | 'achievements' | 'tech' | 'contributions' | 'resume';
}

interface ApiAnalytics {
    totalRequests: number;
    uniqueVisitors: number;
    topEndpoints: { endpoint: string; requests: number }[];
    recentActivity: { endpoint: string; timestamp: string; ip: string }[];
    websiteIntegrations: { website: string; requests: number; lastUsed: string }[];
}

export default function ApiPage() {
    const [activeTab, setActiveTab] = useState('endpoints');
    const [profile, setProfile] = useState<{ username: string } | null>(null);
    const [analytics, setAnalytics] = useState<ApiAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const apiEndpoints: ApiEndpoint[] = [
        {
            name: "Profile",
            path: "/profile",
            method: "GET",
            description: "Get user profile information including name, bio, social links, and avatar",
            example: `curl ${getApiUrl()}/profile`,
            response: `{
  "success": true,
  "data": {
    "name": "John Doe",
    "username": "johndoe",
    "bio": "Full-stack developer...",
    "avatar": "https://...",
    "social": {
      "github": "https://github.com/johndoe",
      "linkedin": "https://linkedin.com/in/johndoe"
    }
  }
}`,
            category: 'profile'
        },
        {
            name: "Projects",
            path: "/projects",
            method: "GET",
            description: "Get all user projects with details, technologies, and links",
            example: `curl ${getApiUrl()}/projects`,
            response: `{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Project Name",
      "description": "Project description...",
      "technologies": ["React", "Node.js"],
      "githubUrl": "https://github.com/...",
      "liveUrl": "https://project.com"
    }
  ]
}`,
            category: 'projects'
        },
        {
            name: "Blog Posts",
            path: "/blog",
            method: "GET",
            description: "Get all published blog posts with content and metadata",
            example: `curl ${getApiUrl()}/blog`,
            response: `{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Blog Post Title",
      "content": "Blog content...",
      "publishedAt": "2024-01-01T00:00:00Z",
      "tags": ["web-development", "react"]
    }
  ]
}`,
            category: 'blog'
        },
        {
            name: "Achievements",
            path: "/achievements",
            method: "GET",
            description: "Get user achievements, certifications, and awards",
            example: `curl ${getApiUrl()}/achievements`,
            response: `{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Achievement Title",
      "description": "Achievement description...",
      "type": "certification",
      "issuer": "Company Name",
      "date": "2024-01-01"
    }
  ]
}`,
            category: 'achievements'
        },
        {
            name: "Tech Stack",
            path: "/techstack",
            method: "GET",
            description: "Get user's technology stack with proficiency levels",
            example: `curl ${getApiUrl()}/techstack`,
            response: `{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "React",
      "category": "frontend",
      "proficiency": "advanced",
      "yearsOfExperience": 3,
      "icon": "https://..."
    }
  ]
}`,
            category: 'tech'
        },
        {
            name: "Contributions",
            path: "/contributions",
            method: "GET",
            description: "Get open source contributions and GitHub activity",
            example: `curl ${getApiUrl()}/contributions`,
            response: `{
  "success": true,
  "data": [
    {
      "id": "1",
      "projectName": "Project Name",
      "description": "Contribution description...",
      "type": "feature",
      "pullRequestUrl": "https://github.com/...",
      "stars": 1000,
      "forks": 500
    }
  ]
}`,
            category: 'contributions'
        },
        {
            name: "Resume",
            path: "/resume",
            method: "GET",
            description: "Get user's resume information and download link",
            example: `curl ${getApiUrl()}/resume`,
            response: `{
  "success": true,
  "data": {
    "fileName": "resume.pdf",
    "fileUrl": "https://...",
    "uploadDate": "2024-01-01",
    "fileSize": 1024000
  }
}`,
            category: 'resume'
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileResponse = await getUserProfile();
                setProfile(profileResponse.user);
                
                // Fetch real analytics data
                try {
                    const analyticsResponse = await fetch('/api/analytics?days=30', {
                        credentials: 'include'
                    });
                    if (analyticsResponse.ok) {
                        const analyticsData = await analyticsResponse.json();
                        setAnalytics(analyticsData.data);
                    } else {
                        // Fallback to mock data if analytics API fails
                        setAnalytics({
                            totalRequests: 0,
                            uniqueVisitors: 0,
                            topEndpoints: [],
                            recentActivity: [],
                            websiteIntegrations: []
                        });
                    }
                } catch (error) {
                    console.error('Failed to fetch analytics:', error);
                    // Fallback to mock data
                    setAnalytics({
                        totalRequests: 0,
                        uniqueVisitors: 0,
                        topEndpoints: [],
                        recentActivity: [],
                        websiteIntegrations: []
                    });
                }
            } catch (error: unknown) {
                console.error('Failed to load data:', error);
                toast.error('Failed to load data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard!`);
    };

    const getApiUrl = () => {
        if (!profile?.username) return 'https://api.devspacee.me/username';
        return `https://api.devspacee.me/${profile.username}`;
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'profile': return <Users className="w-4 h-4" />;
            case 'projects': return <Code className="w-4 h-4" />;
            case 'blog': return <BookOpen className="w-4 h-4" />;
            case 'achievements': return <CheckCircle className="w-4 h-4" />;
            case 'tech': return <Zap className="w-4 h-4" />;
            case 'contributions': return <Github className="w-4 h-4" />;
            case 'resume': return <Link className="w-4 h-4" />;
            default: return <Code className="w-4 h-4" />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'profile': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
            case 'projects': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
            case 'blog': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200';
            case 'achievements': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
            case 'tech': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200';
            case 'contributions': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200';
            case 'resume': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <Code className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Documentation</h1>
                            <p className="text-gray-600 dark:text-gray-400">Public API endpoints to access your portfolio data programmatically</p>
                        </div>
                    </div>
                </motion.div>

                {/* API URL Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-8"
                >
                    <div className="flex items-center space-x-3 mb-4">
                        <Globe className="w-6 h-6 text-blue-600" />
                        <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                            Your API Base URL
                        </h3>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between">
                            <code className="text-sm font-mono text-gray-900 dark:text-white">
                                {getApiUrl()}
                            </code>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => copyToClipboard(getApiUrl(), 'API URL')}
                                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Copy className="w-4 h-4" />
                                <span className="text-sm">Copy</span>
                            </motion.button>
                        </div>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-3">
                        This is your unique API endpoint. All endpoints are public and don't require authentication.
                    </p>
                </motion.div>

                {/* Tab Navigation */}
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden mb-8">
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab('endpoints')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                                activeTab === 'endpoints'
                                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <Code className="w-5 h-5" />
                            <span>Endpoints</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                                activeTab === 'analytics'
                                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <BarChart3 className="w-5 h-5" />
                            <span>Analytics</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('integrations')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                                activeTab === 'integrations'
                                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <Link className="w-5 h-5" />
                            <span>Integrations</span>
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {activeTab === 'endpoints' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                {/* API Endpoints */}
                                <div className="space-y-6">
                                    {apiEndpoints.map((endpoint, index) => (
                                        <motion.div
                                            key={endpoint.path}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
                                        >
                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`p-2 rounded-lg ${getCategoryColor(endpoint.category)}`}>
                                                            {getCategoryIcon(endpoint.category)}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                                {endpoint.name}
                                                            </h3>
                                                            <p className="text-gray-600 dark:text-gray-400">
                                                                {endpoint.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 rounded-full text-sm font-medium">
                                                        {endpoint.method}
                                                    </span>
                                                </div>

                                                <div className="space-y-4">
                                                    {/* Endpoint Path */}
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Endpoint</h4>
                                                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                                                            <code className="text-sm font-mono text-gray-900 dark:text-white">
                                                                {endpoint.path}
                                                            </code>
                                                        </div>
                                                    </div>

                                                    {/* Example Request */}
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Example Request</h4>
                                                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                                                            <div className="flex items-center justify-between">
                                                                <code className="text-sm font-mono text-gray-900 dark:text-white">
                                                                    {endpoint.example}
                                                                </code>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => copyToClipboard(endpoint.example, 'Example')}
                                                                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                                                >
                                                                    <Copy className="w-4 h-4" />
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Response Example */}
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Response Example</h4>
                                                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                                                            <pre className="text-sm font-mono text-gray-900 dark:text-white overflow-x-auto">
                                                                <code>{endpoint.response}</code>
                                                            </pre>
                                                        </div>
                                                    </div>

                                                    {/* Test Button */}
                                                    <div className="flex justify-end">
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => window.open(`${getApiUrl()}${endpoint.path}`, '_blank')}
                                                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                            <span>Test Endpoint</span>
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'analytics' && analytics && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                {/* Analytics Overview */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total API Requests</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalRequests.toLocaleString()}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                                <TrendingUp className="w-6 h-6 text-blue-600" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unique Visitors</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.uniqueVisitors.toLocaleString()}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                                                <Users className="w-6 h-6 text-green-600" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Integrations</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.websiteIntegrations.length}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                                <Link className="w-6 h-6 text-purple-600" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Top Endpoints */}
                                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Most Popular Endpoints</h3>
                                    <div className="space-y-3">
                                        {analytics.topEndpoints.map((endpoint, index) => (
                                            <div key={endpoint.endpoint} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-sm font-bold text-blue-600">
                                                        {index + 1}
                                                    </span>
                                                    <code className="text-sm font-mono text-gray-900 dark:text-white">
                                                        {endpoint.endpoint}
                                                    </code>
                                                </div>
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                    {endpoint.requests.toLocaleString()} requests
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent API Activity</h3>
                                    <div className="space-y-3">
                                        {analytics.recentActivity.map((activity, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <Eye className="w-4 h-4 text-gray-400" />
                                                    <code className="text-sm font-mono text-gray-900 dark:text-white">
                                                        {activity.endpoint}
                                                    </code>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {new Date(activity.timestamp).toLocaleString()}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                                        {activity.ip}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'integrations' && analytics && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                {/* Integration Guide */}
                                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How to Integrate</h3>
                                    <div className="prose dark:prose-invert max-w-none">
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            Add your API to your website, portfolio, or any application to display your data dynamically.
                                        </p>
                                        
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Benefits:</h4>
                                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                            <li>• Real-time data updates across all your platforms</li>
                                            <li>• Automatic portfolio synchronization</li>
                                            <li>• Professional API integration</li>
                                            <li>• Analytics tracking and insights</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Website Integrations */}
                                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Active Website Integrations</h3>
                                    <div className="space-y-4">
                                        {analytics.websiteIntegrations.map((integration, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                                        <Link className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {integration.website}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Last used: {new Date(integration.lastUsed).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {integration.requests.toLocaleString()} requests
                                                    </p>
                                                    <p className="text-sm text-green-600 dark:text-green-400">
                                                        Active
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Integration Examples */}
                                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Integration Examples</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Portfolio Website</h4>
                                            <pre className="text-sm font-mono text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded border overflow-x-auto">
                                                <code>{`// Fetch projects for portfolio
fetch('${getApiUrl()}/projects')
  .then(response => response.json())
  .then(data => {
    // Display projects on your website
    displayProjects(data.data);
  });`}</code>
                                            </pre>
                                        </div>
                                        
                                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">GitHub README</h4>
                                            <pre className="text-sm font-mono text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded border overflow-x-auto">
                                                <code>{`<!-- Add to your README.md -->
![Profile](https://api.devspacee.me/${profile?.username || 'username'}/profile)
![Projects](https://api.devspacee.me/${profile?.username || 'username'}/projects)`}</code>
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
