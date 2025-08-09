"use client";

import { useState, useRef } from 'react';
import SmallCards from "@/components/SmallCards";
import { Upload, FileText, Trash2, Download, CheckCircle } from "lucide-react";

export default function ResumePage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setUploadSuccess(false);
    
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB');
      return;
    }

    setResumeFile(file);
  };

  const handleUpload = () => {
    if (!resumeFile) return;

    setIsUploading(true);
    setError(null);

    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      // Here you would typically upload to your backend
      console.log('Uploading file:', resumeFile);
    }, 1500);
  };

  const handleDelete = () => {
    setResumeFile(null);
    setUploadSuccess(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownload = () => {
    if (!resumeFile) return; // Add null check
    
    const url = URL.createObjectURL(resumeFile); // File extends Blob, so this is safe
    const a = document.createElement('a');
    a.href = url;
    a.download = resumeFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      <SmallCards />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-primaryText dark:text-background">My Resume</h2>
            <p className="text-secondaryText mt-2 max-w-2xl">
              Manage your professional resume. Upload a PDF file under 5MB to keep it updated.
            </p>
          </div>
        </div>

        {/* Resume Upload Area */}
        <div className="bg-white dark:bg-cardDark rounded-xl shadow-sm p-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="mx-auto max-w-md">
              {!resumeFile ? (
                <>
                  <div 
                    onClick={triggerFileInput}
                    className="mx-auto w-24 h-24 bg-gray-100 dark:bg-[#1b254b] rounded-full flex items-center justify-center cursor-pointer mb-4"
                  >
                    <Upload className="w-10 h-10 text-primaryText" />
                  </div>
                  <h3 className="text-lg font-medium text-secondaryText mb-2">Upload Your Resume</h3>
                  <p className="text-secondaryText/65 mb-6">PDF format only, maximum 5MB</p>
                  <button
                    onClick={triggerFileInput}
                    className="bg-primary text-white px-5 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-primary/90 transition-colors mx-auto"
                  >
                    <Upload className="w-5 h-5" />
                    Select PDF File
                  </button>
                </>
              ) : (
                <>
                  <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium text-primaryText mb-1">{resumeFile.name}</h3>
                  <p className="text-gray-500 mb-4">{formatFileSize(resumeFile.size)}</p>
                  
                  <div className="flex justify-center gap-3 mb-6">
                    <button
                      onClick={handleUpload}
                      disabled={isUploading || uploadSuccess}
                      className={`px-5 py-2.5 rounded-lg flex items-center gap-2 ${
                        uploadSuccess 
                          ? 'bg-green-100 text-green-800 cursor-default'
                          : isUploading
                            ? 'bg-gray-100 text-gray-500 cursor-wait'
                            : 'bg-primary text-white hover:bg-primary/90 cursor-pointer'
                      } transition-colors`}
                    >
                      {uploadSuccess ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Uploaded Successfully
                        </>
                      ) : isUploading ? (
                        'Uploading...'
                      ) : (
                        <>
                          <Upload className="w-5 h-5" />
                          Upload Resume
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Remove
                    </button>
                  </div>
                </>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
              />

              {error && (
                <div className="mt-4 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                  {error}
                </div>
              )}

              {uploadSuccess && resumeFile && ( // Added null check here
                <div className="mt-6 border-t pt-6">
                  <button
                    onClick={handleDownload} // Use the safe handler
                    className="text-primary hover:text-primary/90 font-medium flex items-center gap-2 mx-auto"
                  >
                    <Download className="w-5 h-5" />
                    Download Your Resume
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resume Tips */}
        <div className="mt-12 max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-primaryText dark:text-background mb-4">Resume Tips</h3>
          <div className="bg-white dark:bg-cardDark rounded-xl shadow-sm p-6">
            <ul className="space-y-3 list-disc pl-5 text-secondaryText">
              <li>Keep your resume to 1-2 pages maximum</li>
              <li>Use clear section headings (Experience, Education, Skills)</li>
              <li>Include measurable achievements (e.g., &quot;Increased performance by 40%&quot;)</li>
              <li>Update your resume every 6 months or after significant achievements</li>
              <li>Save as &quot;YourName_Resume.pdf&quot; for professional file naming</li>
              <li>Ensure all links (GitHub, LinkedIn, etc.) are up-to-date</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}