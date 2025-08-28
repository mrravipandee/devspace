"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SmallCards from "@/components/SmallCards";
import ResumeUpload from "@/components/ResumeUpload";
import { getResume, uploadResume, deleteResume } from '@/lib/apiClient';
import { toast } from 'sonner';

export default function ResumePage() {
  const [currentResume, setCurrentResume] = useState<{
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    fileType: string;
    uploadDate: string;
    isActive: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      setIsLoading(true);
      const response = await getResume();
      setCurrentResume(response.data);
    } catch (error) {
      console.error('Failed to fetch resume:', error);
      // Don't show error toast if no resume exists
      if (error instanceof Error && !error.message.includes('not found')) {
        toast.error('Failed to load resume');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeUpload = async (resumeData: {
    fileName: string;
    fileUrl: string;
    fileSize: number;
    fileType: string;
  }) => {
    try {
      const response = await uploadResume(resumeData);
      setCurrentResume(response.data);
      toast.success('Resume uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload resume:', error);
      toast.error('Failed to upload resume');
    }
  };

  const handleResumeDelete = async () => {
    if (!currentResume?.id) return;
    
    try {
      await deleteResume(currentResume.id);
      setCurrentResume(null);
      toast.success('Resume deleted successfully');
    } catch (error) {
      console.error('Failed to delete resume:', error);
      toast.error('Failed to delete resume');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <SmallCards />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your resume...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SmallCards />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    My Resume
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage your professional resume. Upload a PDF file under 5MB to keep it updated.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Resume Upload Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <ResumeUpload
            onResumeUpload={handleResumeUpload}
            onResumeDelete={handleResumeDelete}
            currentResume={currentResume}
          />
        </motion.div>

        {/* Additional Features */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resume Analytics */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Resume Analytics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    currentResume 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200'
                  }`}>
                    {currentResume ? 'Active' : 'No Resume'}
                  </span>
                </div>
                {currentResume && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">File Size</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {(currentResume.fileSize / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Upload Date</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {new Date(currentResume.uploadDate).toLocaleDateString()}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.open('https://www.canva.com/resumes/', '_blank')}
                  className="w-full text-left p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <div className="font-medium text-blue-900 dark:text-blue-100">Create Resume</div>
                  <div className="text-sm text-blue-700 dark:text-blue-200">Use Canva templates</div>
                </button>
                <button
                  onClick={() => window.open('https://www.resume.com/', '_blank')}
                  className="w-full text-left p-3 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <div className="font-medium text-green-900 dark:text-green-100">Resume Builder</div>
                  <div className="text-sm text-green-700 dark:text-green-200">Professional templates</div>
                </button>
                <button
                  onClick={() => window.open('https://www.grammarly.com/', '_blank')}
                  className="w-full text-left p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <div className="font-medium text-purple-900 dark:text-purple-100">Grammar Check</div>
                  <div className="text-sm text-purple-700 dark:text-purple-200">Polish your content</div>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}