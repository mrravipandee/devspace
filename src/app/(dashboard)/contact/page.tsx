"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Mail, User, Calendar, MapPin, Eye, EyeOff, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  userIp: string;
  userAgent: string;
  location: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export default function ContactPage() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/contact');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch contacts');
      }
      
      setContacts(data.contacts);
    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to load contact messages');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'read' | 'replied') => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        setContacts(prev => prev.map(contact => 
          contact._id === id ? { ...contact, status } : contact
        ));
        toast.success('Status updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'read': return <Eye className="w-4 h-4 text-blue-500" />;
      case 'replied': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'unread': return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      case 'read': return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
      case 'replied': return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      default: return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'all') return true;
    return contact.status === filter;
  });

  const stats = {
    total: contacts.length,
    unread: contacts.filter(c => c.status === 'unread').length,
    read: contacts.filter(c => c.status === 'read').length,
    replied: contacts.filter(c => c.status === 'replied').length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-cardDark">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary/80 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading contact messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-cardDark">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchContacts} 
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cardDark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Contact Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and respond to messages from your portfolio visitors
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unread</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.unread}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Read</p>
                <p className="text-2xl font-bold text-blue-600">{stats.read}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Replied</p>
                <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex space-x-4">
            {[
              { key: 'all', label: 'All', count: stats.total },
              { key: 'unread', label: 'Unread', count: stats.unread },
              { key: 'read', label: 'Read', count: stats.read },
              { key: 'replied', label: 'Replied', count: stats.replied }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Messages List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No messages found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {contact.name}
                        </h3>
                        <span className={getStatusBadge(contact.status)}>
                          {getStatusIcon(contact.status)}
                          <span className="ml-1 capitalize">{contact.status}</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{contact.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{contact.location}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {contact.message}
                      </p>
                      
                      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        <p>IP: {contact.userIp}</p>
                        <p>User Agent: {contact.userAgent.substring(0, 100)}...</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {contact.status === 'unread' && (
                        <button
                          onClick={() => updateStatus(contact._id, 'read')}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {contact.status !== 'replied' && (
                        <button
                          onClick={() => updateStatus(contact._id, 'replied')}
                          className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Mark as replied"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
