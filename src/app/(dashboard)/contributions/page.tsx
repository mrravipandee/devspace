"use client";

import { useState, useRef } from 'react';
import SmallCards from "@/components/SmallCards";
import { Github, GitPullRequest, Star, GitFork, Code2, PlusCircle, Trash2, Edit, X, ImageIcon } from "lucide-react";
import Image from "next/image";

type Contribution = {
  id: string;
  projectName: string;
  projectUrl: string;
  description: string;
  contributionType: 'bug-fix' | 'feature' | 'documentation' | 'translation' | 'other';
  pullRequestUrl: string;
  stars: number;
  forks: number;
  technologies: string[];
  date: string;
  projectLogo?: string;
};

export default function OpenSourcePage() {
  const [contributions, setContributions] = useState<Contribution[]>([
    {
      id: '1',
      projectName: 'Next.js',
      projectUrl: 'https://github.com/vercel/next.js',
      description: 'Fixed hydration mismatch in dynamic routes',
      contributionType: 'bug-fix',
      pullRequestUrl: 'https://github.com/vercel/next.js/pull/12345',
      stars: 120000,
      forks: 25000,
      technologies: ['React', 'JavaScript', 'SSR'],
      date: '2025-03-15',
      projectLogo: '/nextjs-logo.png'
    },
    {
      id: '2',
      projectName: 'React',
      projectUrl: 'https://github.com/facebook/react',
      description: 'Added new hook for managing subscriptions',
      contributionType: 'feature',
      pullRequestUrl: 'https://github.com/facebook/react/pull/67890',
      stars: 220000,
      forks: 45000,
      technologies: ['React', 'JavaScript'],
      date: '2025-02-20'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContribution, setCurrentContribution] = useState<Contribution | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateNew = () => {
    setCurrentContribution({
      id: '',
      projectName: '',
      projectUrl: '',
      description: '',
      contributionType: 'bug-fix',
      pullRequestUrl: '',
      stars: 0,
      forks: 0,
      technologies: [],
      date: new Date().toISOString().split('T')[0]
    });
    setLogoPreview(null);
    setIsModalOpen(true);
  };

  const handleEdit = (contribution: Contribution) => {
    setCurrentContribution(contribution);
    setLogoPreview(contribution.projectLogo || null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this contribution?')) {
      setContributions(contributions.filter(contribution => contribution.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newContributionData = {
      id: currentContribution?.id || Date.now().toString(),
      projectName: formData.get('projectName') as string,
      projectUrl: formData.get('projectUrl') as string,
      description: formData.get('description') as string,
      contributionType: formData.get('contributionType') as Contribution['contributionType'],
      pullRequestUrl: formData.get('pullRequestUrl') as string,
      stars: Number(formData.get('stars')),
      forks: Number(formData.get('forks')),
      technologies: (formData.get('technologies') as string).split(',').map(tech => tech.trim()),
      date: formData.get('date') as string,
      projectLogo: logoPreview || undefined
    };

    if (currentContribution?.id) {
      // Update existing contribution
      setContributions(contributions.map(contribution => 
        contribution.id === currentContribution.id ? newContributionData : contribution
      ));
    } else {
      // Add new contribution
      setContributions([...contributions, newContributionData]);
    }

    setIsModalOpen(false);
    setCurrentContribution(null);
    setLogoPreview(null);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getContributionTypeColor = (type: Contribution['contributionType']) => {
    switch (type) {
      case 'bug-fix': return 'bg-red-100 text-red-800';
      case 'feature': return 'bg-green-100 text-green-800';
      case 'documentation': return 'bg-blue-100 text-blue-800';
      case 'translation': return 'bg-purple-100 text-purple-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen">
      <SmallCards />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-primaryText dark:text-background">Open Source Contributions</h2>
            <p className="text-secondaryText mt-2 max-w-2xl">
              A showcase of my contributions to open source projects and communities.
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="bg-primary text-white px-5 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            <PlusCircle className="w-5 h-5" />
            Add Contribution
          </button>
        </div>

        {/* Contributions List */}
        <div className="grid grid-cols-1 gap-6">
          {contributions.map(contribution => (
            <div key={contribution.id} className="bg-white dark:bg-cardDark rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {contribution.projectLogo ? (
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={contribution.projectLogo}
                        alt={contribution.projectName}
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Github className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-primaryText dark:text-background">
                          <a href={contribution.projectUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {contribution.projectName}
                          </a>
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getContributionTypeColor(contribution.contributionType)}`}>
                            {contribution.contributionType.replace('-', ' ')}
                          </span>
                          <span className="text-sm text-secondaryText/80">
                            {new Date(contribution.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(contribution)}
                          className="text-secondaryText hover:text-primary p-1 rounded-full hover:bg-gray-100"
                          title="Edit contribution"
                          aria-label="Edit contribution"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(contribution.id)}
                          className="text-secondaryText hover:text-primary p-1 rounded-full hover:bg-gray-100"
                          title="Delete contribution"
                          aria-label="Delete contribution"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-secondaryText my-4">{contribution.description}</p>

                    <div className="flex flex-wrap items-center gap-4">
                      <a 
                        href={contribution.pullRequestUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-500 hover:text-primary/80 font-medium flex items-center gap-1"
                      >
                        <GitPullRequest className="w-4 h-4" />
                        View Pull Request
                      </a>

                      <div className="flex items-center gap-4 text-sm text-secondaryText/80">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {formatNumber(contribution.stars)}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-4 h-4" />
                          {formatNumber(contribution.forks)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {contribution.technologies.map(tech => (
                        <span 
                          key={tech} 
                          className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {contributions.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto max-w-md">
              <Code2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-primaryText mb-2">No contributions yet</h3>
              <p className="text-secondaryText mb-6">Start building your open source portfolio by adding your first contribution.</p>
              <button
                onClick={handleCreateNew}
                className="bg-primary text-white px-5 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-primary/90 transition-colors mx-auto"
              >
                <PlusCircle className="w-5 h-5" />
                Add First Contribution
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Contribution Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primaryText">
                  {currentContribution?.id ? 'Edit Contribution' : 'Add New Contribution'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentContribution(null);
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project Name*</label>
                      <input
                        type="text"
                        name="projectName"
                        defaultValue={currentContribution?.projectName || ''}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        placeholder="e.g. Next.js"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contribution Type*</label>
                      <select
                        name="contributionType"
                        defaultValue={currentContribution?.contributionType || 'bug-fix'}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="bug-fix">Bug Fix</option>
                        <option value="feature">Feature</option>
                        <option value="documentation">Documentation</option>
                        <option value="translation">Translation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project URL*</label>
                      <input
                        type="url"
                        name="projectUrl"
                        defaultValue={currentContribution?.projectUrl || ''}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        placeholder="https://github.com/org/repo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pull Request URL*</label>
                      <input
                        type="url"
                        name="pullRequestUrl"
                        defaultValue={currentContribution?.pullRequestUrl || ''}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        placeholder="https://github.com/org/repo/pull/123"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description*</label>
                    <textarea
                      name="description"
                      defaultValue={currentContribution?.description || ''}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      placeholder="Describe your contribution..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stars</label>
                      <input
                        type="number"
                        name="stars"
                        min="0"
                        defaultValue={currentContribution?.stars || 0}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Forks</label>
                      <input
                        type="number"
                        name="forks"
                        min="0"
                        defaultValue={currentContribution?.forks || 0}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date*</label>
                      <input
                        type="date"
                        name="date"
                        defaultValue={currentContribution?.date || ''}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Technologies (comma separated)</label>
                    <input
                      type="text"
                      name="technologies"
                      defaultValue={currentContribution?.technologies.join(', ') || ''}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="React, JavaScript, TypeScript"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Logo</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleLogoChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="space-y-2">
                      <div
                        onClick={triggerFileInput}
                        className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                          logoPreview ? 'border-transparent' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {logoPreview ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={logoPreview}
                              alt="Preview"
                              fill
                              className="object-contain p-4 rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLogoPreview(null);
                              }}
                              className="absolute top-3 right-3 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-sm"
                              aria-label="Remove logo"
                            >
                              <X size={18} className="text-red-600" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center p-4">
                            <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">Click to upload a logo</p>
                            <p className="text-xs text-gray-400 mt-1">Recommended: 256x256px transparent PNG</p>
                          </div>
                        )}
                      </div>
                      {currentContribution?.projectLogo && !logoPreview && (
                        <p className="text-sm text-gray-500">Current logo will be kept if no new logo is selected</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setCurrentContribution(null);
                    }}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    {currentContribution?.id ? 'Update Contribution' : 'Add Contribution'}
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