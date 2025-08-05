"use client";

import { useRef, useState } from 'react';
import SmallCards from "@/components/SmallCards";
import { PlusCircle, Trash2, Edit, X, Image as ImageIcon, Award, Trophy, FileBadge, Briefcase } from "lucide-react";
import Image from "next/image";

type Achievement = { 
  id: string;
  title: string;
  description: string;
  type: 'certification' | 'hackathon' | 'internship' | 'project' | 'challenge';
  image: string;
  issuer: string;
  date: string;
  verificationUrl: string;
  skills: string[];
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'AWS Certified Developer',
      description: 'Earned AWS Certified Developer - Associate certification',
      type: 'certification',
      image: '/cert-placeholder.jpg',
      issuer: 'Amazon Web Services',
      date: '2025-03-15',
      verificationUrl: 'https://aws.amazon.com/certification/',
      skills: ['AWS', 'Cloud Computing', 'Serverless']
    },
    {
      id: '2',
      title: '1st Place - Hack the Future',
      description: 'Won first place in the annual Hack the Future hackathon',
      type: 'hackathon',
      image: '/hackathon-placeholder.jpg',
      issuer: 'Tech Innovators Inc.',
      date: '2025-02-20',
      verificationUrl: 'https://hackthefuture.dev/winners',
      skills: ['React', 'Node.js', 'AI Integration']
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateNew = () => {
    setCurrentAchievement({
      id: '',
      title: '',
      description: '',
      type: 'certification',
      image: '',
      issuer: '',
      date: new Date().toISOString().split('T')[0],
      verificationUrl: '',
      skills: []
    });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleEdit = (achievement: Achievement) => {
    setCurrentAchievement(achievement);
    setImagePreview(achievement.image);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this achievement?')) {
      setAchievements(achievements.filter(achievement => achievement.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newAchievementData = {
      id: currentAchievement?.id || Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as Achievement['type'],
      image: imagePreview || '/achievement-placeholder.jpg',
      issuer: formData.get('issuer') as string,
      date: formData.get('date') as string,
      verificationUrl: formData.get('verificationUrl') as string,
      skills: (formData.get('skills') as string).split(',').map(skill => skill.trim()),
    };

    if (currentAchievement?.id) {
      // Update existing achievement
      setAchievements(achievements.map(achievement => 
        achievement.id === currentAchievement.id ? newAchievementData : achievement
      ));
    } else {
      // Add new achievement
      setAchievements([...achievements, newAchievementData]);
    }

    setIsModalOpen(false);
    setCurrentAchievement(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getAchievementIcon = (type: Achievement['type']) => {
    switch (type) {
      case 'certification': return <FileBadge className="w-5 h-5 text-blue-500" />;
      case 'hackathon': return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'internship': return <Briefcase className="w-5 h-5 text-green-500" />;
      case 'project': return <ImageIcon className="w-5 h-5 text-purple-500" />;
      case 'challenge': return <Award className="w-5 h-5 text-red-500" />;
      default: return <Award className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SmallCards />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-primaryText">My Achievements</h2>
            <p className="text-secondaryText mt-2 max-w-2xl">
              A showcase of my professional accomplishments, certifications, and recognitions.
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="bg-primary text-white px-5 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            <PlusCircle className="w-5 h-5" />
            Add Achievement
          </button>
        </div>

        {/* Achievements List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {achievements.map(achievement => (
            <div key={achievement.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {achievement.image && (
                  <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                    <Image
                      src={achievement.image}
                      alt={achievement.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {getAchievementIcon(achievement.type)}
                      <h3 className="text-xl font-bold text-primaryText">{achievement.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(achievement)}
                        className="text-secondaryText hover:text-primary p-1 rounded-full hover:bg-gray-100"
                        title="Edit achievement"
                        aria-label="Edit achievement"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(achievement.id)}
                        className="text-secondaryText hover:text-red-600 p-1 rounded-full hover:bg-gray-100"
                        title="Delete achievement"
                        aria-label="Delete achievement"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <span>{achievement.issuer}</span>
                    <span>•</span>
                    <span>{achievement.date}</span>
                  </div>
                  <p className="text-gray-600 my-4">{achievement.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {achievement.skills.map(skill => (
                      <span 
                        key={skill} 
                        className="bg-background text-primary text-xs px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <a 
                      href={achievement.verificationUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/90 font-medium"
                    >
                      Verify this achievement
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {achievements.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto max-w-md">
              <Award className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-primaryText mb-2">No achievements yet</h3>
              <p className="text-secondaryText mb-6">Start building your achievements portfolio by adding your first accomplishment.</p>
              <button
                onClick={handleCreateNew}
                className="bg-primary text-white px-5 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-primary/90 transition-colors mx-auto"
              >
                <PlusCircle className="w-5 h-5" />
                Add First Achievement
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Achievement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primaryText">
                  {currentAchievement?.id ? 'Edit Achievement' : 'Add New Achievement'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentAchievement(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title*</label>
                      <input
                        type="text"
                        name="title"
                        defaultValue={currentAchievement?.title || ''}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        placeholder="Achievement title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type*</label>
                      <select
                        name="type"
                        defaultValue={currentAchievement?.type || 'certification'}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="certification">Certification</option>
                        <option value="hackathon">Hackathon</option>
                        <option value="internship">Internship</option>
                        <option value="project">Project</option>
                        <option value="challenge">Coding Challenge</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description*</label>
                    <textarea
                      name="description"
                      defaultValue={currentAchievement?.description || ''}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      placeholder="Describe your achievement"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Issuer/Organization*</label>
                      <input
                        type="text"
                        name="issuer"
                        defaultValue={currentAchievement?.issuer || ''}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        placeholder="Company or organization name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date*</label>
                      <input
                        type="date"
                        name="date"
                        defaultValue={currentAchievement?.date || ''}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Verification URL*</label>
                    <input
                      type="url"
                      name="verificationUrl"
                      defaultValue={currentAchievement?.verificationUrl || ''}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      placeholder="https://example.com/verification"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma separated)</label>
                    <input
                      type="text"
                      name="skills"
                      defaultValue={currentAchievement?.skills.join(', ') || ''}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="JavaScript, React, Cloud Computing"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Certificate/Badge Image</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="space-y-2">
                      <div
                        onClick={triggerFileInput}
                        className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                          imagePreview ? 'border-transparent' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {imagePreview ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={imagePreview}
                              alt="Preview"
                              fill
                              className="object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImagePreview(null);
                              }}
                              className="absolute top-3 right-3 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-sm"
                              aria-label="Remove image"
                            >
                              <X size={18} className="text-red-600" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center p-4">
                            <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">Click to upload an image</p>
                            <p className="text-xs text-gray-400 mt-1">Recommended size: 800x600px</p>
                          </div>
                        )}
                      </div>
                      {currentAchievement?.image && !imagePreview && (
                        <p className="text-sm text-gray-500">Current image will be kept if no new image is selected</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setCurrentAchievement(null);
                    }}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    {currentAchievement?.id ? 'Update Achievement' : 'Add Achievement'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}