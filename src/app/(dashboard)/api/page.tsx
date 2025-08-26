"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
    Code, 
    Key, 
    Copy, 
    RefreshCw, 
    Eye, 
    EyeOff, 
    BookOpen,
    Terminal,
    Globe,
    Zap,
    X
} from 'lucide-react';
import { getUserProfile } from '@/lib/apiClient';

// API functions for managing API keys
const fetchApiKeys = async () => {
  const response = await fetch('/api/api-keys', {
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to fetch API keys');
  return response.json();
};

const generateApiKey = async (name: string) => {
  const response = await fetch('/api/api-keys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name })
  });
  if (!response.ok) throw new Error('Failed to generate API key');
  return response.json();
};

const deleteApiKey = async (id: string) => {
  const response = await fetch(`/api/api-keys/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to delete API key');
  return response.json();
};

interface ApiKey {
    id: string;
    name: string;
    key: string;
    isActive: boolean;
    createdAt: string;
    lastUsed?: string;
}

export default function ApiPage() {
    const [activeTab, setActiveTab] = useState('api');
    const [profile, setProfile] = useState<{ username: string } | null>(null);
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [showApiKey, setShowApiKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [showNewKey, setShowNewKey] = useState<ApiKey | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileResponse, apiKeysResponse] = await Promise.all([
                    getUserProfile(),
                    fetchApiKeys()
                ]);
                setProfile(profileResponse.user);
                setApiKeys(apiKeysResponse.apiKeys);
                    } catch (error: unknown) {
            console.error('Failed to load data:', error);
            toast.error('Failed to load data');
        } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleGenerateApiKey = async () => {
        if (!newKeyName.trim()) {
            toast.error('Please enter a name for the API key');
            return;
        }

        try {
            setIsGenerating(true);
            const response = await generateApiKey(newKeyName.trim());
            const newKey = response.apiKey;
            
            setApiKeys(prev => [newKey, ...prev]);
            setShowNewKey(newKey);
            setNewKeyName('');
            toast.success('API key generated successfully!');
        } catch (error: unknown) {
            console.error('Failed to generate API key:', error);
            toast.error('Failed to generate API key');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDeleteApiKey = async (id: string) => {
        try {
            await deleteApiKey(id);
            setApiKeys(prev => prev.filter(key => key.id !== id));
            toast.success('API key deleted successfully!');
        } catch (error: unknown) {
            console.error('Failed to delete API key:', error);
            toast.error('Failed to delete API key');
        }
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard!`);
    };

    const toggleApiKeyVisibility = (keyId: string) => {
        setShowApiKey(showApiKey === keyId ? null : keyId);
    };

    const getApiUrl = () => {
        if (!profile?.username) return '';
        return `https://api.devspacee.me/${profile.username}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
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
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Management</h1>
                            <p className="text-gray-600 dark:text-gray-400">Manage your API keys and access your data programmatically</p>
                        </div>
                    </div>
                </motion.div>

                {/* Tab Navigation */}
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden mb-8">
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab('api')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                                activeTab === 'api'
                                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <Key className="w-5 h-5" />
                            <span>API Keys</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('docs')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                                activeTab === 'docs'
                                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <BookOpen className="w-5 h-5" />
                            <span>Documentation</span>
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {activeTab === 'api' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                {/* API URL Section */}
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <Globe className="w-6 h-6 text-blue-600" />
                                        <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                                            Your API Endpoint
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
                                        This is your unique API endpoint. Use it with your API keys to access your data.
                                    </p>
                                </div>

                                {/* API Keys Section */}
                                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl border border-white/20 dark:border-gray-700/50">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                                <Key className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                API Keys
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Generate New Key Form */}
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-600">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Generate New API Key
                                        </h3>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="text"
                                                value={newKeyName}
                                                onChange={(e) => setNewKeyName(e.target.value)}
                                                placeholder="Enter API key name"
                                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                                            />
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleGenerateApiKey}
                                                disabled={isGenerating || !newKeyName.trim()}
                                                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                            >
                                                {isGenerating ? (
                                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Zap className="w-4 h-4" />
                                                )}
                                                <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Newly Generated Key Display */}
                                    {showNewKey && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-6"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                                                    🎉 New API Key Generated!
                                                </h3>
                                                <button
                                                    onClick={() => setShowNewKey(null)}
                                                    className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-800">
                                                <div className="flex items-center justify-between">
                                                    <code className="text-sm font-mono text-gray-900 dark:text-white">
                                                        {showNewKey.key}
                                                    </code>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => copyToClipboard(showNewKey.key, 'API Key')}
                                                        className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                        <span className="text-sm">Copy</span>
                                                    </motion.button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-green-700 dark:text-green-300 mt-3">
                                                ⚠️ Make sure to copy this key now. You won&apos;t be able to see it again!
                                            </p>
                                        </motion.div>
                                    )}

                                    {apiKeys.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Key className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                No API Keys Yet
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                Generate your first API key to start accessing your data programmatically.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {apiKeys.map((apiKey) => (
                                                <motion.div
                                                    key={apiKey.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600"
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                                {apiKey.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                Created {new Date(apiKey.createdAt).toLocaleDateString()}
                                                                {apiKey.lastUsed && (
                                                                    <span className="ml-2">
                                                                        • Last used {new Date(apiKey.lastUsed).toLocaleDateString()}
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                apiKey.isActive 
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                            }`}>
                                                                {apiKey.isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => handleDeleteApiKey(apiKey.id)}
                                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                title="Delete API key"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                                        <div className="flex items-center justify-between">
                                                            <code className="text-sm font-mono text-gray-900 dark:text-white">
                                                                {showApiKey === apiKey.id ? apiKey.key : '••••••••••••••••••••••••••••••••'}
                                                            </code>
                                                            <div className="flex items-center space-x-2">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => toggleApiKeyVisibility(apiKey.id)}
                                                                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                                                >
                                                                    {showApiKey === apiKey.id ? (
                                                                        <EyeOff className="w-4 h-4" />
                                                                    ) : (
                                                                        <Eye className="w-4 h-4" />
                                                                    )}
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => copyToClipboard(apiKey.key, 'API Key')}
                                                                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                                                >
                                                                    <Copy className="w-4 h-4" />
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Usage Examples */}
                                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl border border-white/20 dark:border-gray-700/50">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                                            <Terminal className="w-5 h-5 text-white" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            Quick Examples
                                        </h2>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Get Profile Data</h4>
                                            <code className="text-sm font-mono text-gray-700 dark:text-gray-300 block bg-white dark:bg-gray-800 p-3 rounded border">
                                                curl -H &quot;Authorization: Bearer YOUR_API_KEY&quot; {getApiUrl()}/profile
                                            </code>
                                        </div>
                                        
                                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Get Projects</h4>
                                            <code className="text-sm font-mono text-gray-700 dark:text-gray-300 block bg-white dark:bg-gray-800 p-3 rounded border">
                                                curl -H &quot;Authorization: Bearer YOUR_API_KEY&quot; {getApiUrl()}/projects
                                            </code>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'docs' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                {/* API Documentation */}
                                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl border border-white/20 dark:border-gray-700/50">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                            <BookOpen className="w-5 h-5 text-white" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            API Documentation
                                        </h2>
                                    </div>

                                    <div className="prose dark:prose-invert max-w-none">
                                        <h3>Authentication</h3>
                                        <p>All API requests require authentication using your API key in the Authorization header:</p>
                                        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                            <code>Authorization: Bearer YOUR_API_KEY</code>
                                        </pre>

                                        <h3>Base URL</h3>
                                        <p>Your API base URL is:</p>
                                        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                            <code>{getApiUrl()}</code>
                                        </pre>

                                        <h3>Endpoints</h3>
                                        
                                        <h4>GET /profile</h4>
                                        <p>Retrieve your profile information.</p>
                                        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                            <code>curl -H &quot;Authorization: Bearer YOUR_API_KEY&quot; {getApiUrl()}/profile</code>
                                        </pre>

                                        <h4>GET /projects</h4>
                                        <p>Retrieve your projects list.</p>
                                        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                            <code>curl -H &quot;Authorization: Bearer YOUR_API_KEY&quot; {getApiUrl()}/projects</code>
                                        </pre>

                                        <h4>GET /blog</h4>
                                        <p>Retrieve your blog posts.</p>
                                        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                            <code>curl -H &quot;Authorization: Bearer YOUR_API_KEY&quot; {getApiUrl()}/blog</code>
                                        </pre>

                                        <h4>GET /achievements</h4>
                                        <p>Retrieve your achievements.</p>
                                        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                            <code>curl -H &quot;Authorization: Bearer YOUR_API_KEY&quot; {getApiUrl()}/achievements</code>
                                        </pre>

                                        <h3>Response Format</h3>
                                        <p>All API responses are returned in JSON format:</p>
                                        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                            <code>{`{
  "success": true,
  "data": {
    // Response data
  }
}`}</code>
                                        </pre>

                                        <h3>Error Handling</h3>
                                        <p>Error responses include an error message:</p>
                                        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                            <code>{`{
  "success": false,
  "error": "Error message"
}`}</code>
                                        </pre>

                                        <h3>Rate Limiting</h3>
                                        <p>API requests are limited to 1000 requests per hour per API key.</p>

                                        <h3>Security</h3>
                                        <p>Keep your API keys secure and never share them publicly. If you suspect a key has been compromised, regenerate it immediately.</p>
                                    </div>
                                </div>

                                {/* SDK Examples */}
                                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl border border-white/20 dark:border-gray-700/50">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                                            <Code className="w-5 h-5 text-white" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            SDK Examples
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">JavaScript/Node.js</h4>
                                            <pre className="text-sm font-mono text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded border overflow-x-auto">
                                                <code>{`const response = await fetch('${getApiUrl()}/profile', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});
const data = await response.json();`}</code>
                                            </pre>
                                        </div>
                                        
                                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Python</h4>
                                            <pre className="text-sm font-mono text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded border overflow-x-auto">
                                                <code>{`import requests

response = requests.get('${getApiUrl()}/profile', 
    headers={'Authorization': 'Bearer YOUR_API_KEY'})
data = response.json()`}</code>
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
