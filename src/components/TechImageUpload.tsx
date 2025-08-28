"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface TechImageUploadProps {
  currentImage?: string;
  onImageUpload: (url: string, publicId: string) => void;
  className?: string;
}

export default function TechImageUpload({ 
  currentImage, 
  onImageUpload, 
  className = "" 
}: TechImageUploadProps) {
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

    // Validate file size (max 2MB for icons)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Icon size should be less than 2MB');
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
      toast.success('Technology icon uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload icon. Please try again.');
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
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 mx-auto">
                <Image
                  src={previewUrl}
                  alt="Technology icon preview"
                  fill
                  className="object-contain p-4"
                  sizes="128px"
                />
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={triggerFileInput}
                      className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-lg transition-colors"
                      title="Change icon"
                    >
                      <Upload className="w-4 h-4 text-gray-700" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRemoveImage}
                      className="p-2 bg-red-500/90 hover:bg-red-500 rounded-lg shadow-lg transition-colors"
                      title="Remove icon"
                    >
                      <X className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                </div>

                {/* Upload indicator */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin mx-auto mb-2" />
                      <p className="text-white text-xs">Uploading...</p>
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
              className="w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors group mx-auto"
            >
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Upload Icon
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  Click to upload
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help text */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Upload a technology icon (PNG/SVG recommended, max 2MB)
          </p>
        </div>
      </div>
    </div>
  );
}
