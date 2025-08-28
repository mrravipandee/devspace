"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface AchievementImageUploadProps {
  currentImage?: string;
  onImageUpload: (url: string, publicId: string) => void;
  className?: string;
}

export default function AchievementImageUpload({ 
  currentImage, 
  onImageUpload, 
  className = "" 
}: AchievementImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onImageUpload(data.url, data.publicId);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
      setPreviewUrl(currentImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUpload('', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="space-y-4">
        {/* Preview Area */}
        <AnimatePresence mode="wait">
          {previewUrl ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative group"
            >
              <div className="relative w-full h-64 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                <Image
                  src={previewUrl}
                  alt="Achievement preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={triggerFileInput}
                      className="p-3 bg-white/90 hover:bg-white rounded-xl shadow-lg transition-colors"
                      title="Change image"
                    >
                      <Upload className="w-5 h-5 text-gray-700" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRemoveImage}
                      className="p-3 bg-red-500/90 hover:bg-red-500 rounded-xl shadow-lg transition-colors"
                      title="Remove image"
                    >
                      <X className="w-5 h-5 text-white" />
                    </motion.button>
                  </div>
                </div>

                {/* Upload indicator */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
                      <p className="text-white text-sm">Uploading...</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={triggerFileInput}
              className="w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors group"
            >
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ImageIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Upload Achievement Image
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  Click to upload a certificate, badge, or achievement image
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                  <span>PNG, JPG, GIF</span>
                  <span>•</span>
                  <span>Max 5MB</span>
                  <span>•</span>
                  <span>800x600 recommended</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help text */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Upload a high-quality image of your certificate, badge, or achievement for better presentation
          </p>
        </div>
      </div>
    </div>
  );
}
