"use client";

import { useState, useEffect, useRef } from 'react';
import { PlusCircle, X, Image as ImageIcon, Trash2, AlertCircle } from "lucide-react";
import Image from "next/image";
import ProjectStats from "./_components/ProjectStats";
import ProjectFilters from "./_components/ProjectFilters";
import ProjectCard from "./_components/ProjectCard";
import ProjectListView from "./_components/ProjectListView";

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  tags: string[];
  status: string;
  progress: number;
  liveLink?: string;
  sourceCode?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectFormData {
  title: string;
  description: string;
  image: string;
  techStack: string[];
  tags: string[];
  status: string;
  progress: number;
  liveLink: string;
  sourceCode: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [totalProjects, setTotalProjects] = useState(0);
  
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    image: '',
    techStack: [],
    tags: [],
    status: 'Planned',
    progress: 0,
    liveLink: '',
    sourceCode: ''
  });
  
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch projects from API
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      const result = await response.json();
      
      if (result.success) {
        setProjects(result.data.projects);
        setFilteredProjects(result.data.projects);
        setTotalProjects(result.data.stats.total);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort projects
  useEffect(() => {
    let filtered = [...projects];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'progress':
        filtered.sort((a, b) => b.progress - a.progress);
        break;
      case 'status':
        filtered.sort((a, b) => a.status.localeCompare(b.status));
        break;
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter, sortBy]);

  const handleCreateProject = async () => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchProjects();
        resetForm();
        setIsModalOpen(false);
      } else {
        alert('Failed to create project: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;

    try {
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingProject._id,
          ...formData,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchProjects();
        resetForm();
        setIsModalOpen(false);
        setIsEditing(false);
        setEditingProject(null);
      } else {
        alert('Failed to update project: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchProjects();
      } else {
        alert('Failed to delete project: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsEditing(true);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      techStack: project.tech,
      tags: project.tags,
      status: project.status,
      progress: project.progress,
      liveLink: project.liveLink || '',
      sourceCode: project.sourceCode || ''
    });
    setImagePreview(project.image);
    setIsModalOpen(true);
  };

  const handleViewProject = (project: Project) => {
    // Implement project detail view
    console.log('View project:', project);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      techStack: [],
      tags: [],
      status: 'Planned',
      progress: 0,
      liveLink: '',
      sourceCode: ''
    });
    setTagInput('');
    setImagePreview(null);
    setIsEditing(false);
    setEditingProject(null);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (['Enter', ','].includes(e.key)) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, newTag],
        });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({
          ...formData,
          image: result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData({
      ...formData,
      image: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Project Statistics */}
      <ProjectStats />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Projects</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage and track your project portfolio
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Create New Project <PlusCircle size={18} />
          </button>
        </div>

        {/* Filters */}
        <ProjectFilters
          onSearch={setSearchTerm}
          onStatusFilter={setStatusFilter}
          onSort={setSortBy}
          onViewChange={setViewMode}
          currentView={viewMode}
          totalProjects={totalProjects}
        />

        {/* Projects Display */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="bg-white dark:bg-cardDark rounded-xl p-4 animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
                onView={handleViewProject}
              />
            ))}
          </div>
        ) : (
          <ProjectListView
            projects={filteredProjects}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            onView={handleViewProject}
          />
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No projects found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'Create your first project to get started'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Project
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-cardDark rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {isEditing ? 'Edit Project' : 'Create New Project'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Project Title*
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Enter project title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Enter project description"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tech Stack (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.techStack.join(', ')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          techStack: e.target.value.split(',').map(t => t.trim()).filter(t => t),
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Live Link
                    </label>
                    <input
                      type="url"
                      value={formData.liveLink}
                      onChange={(e) =>
                        setFormData({ ...formData, liveLink: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="https://your-project.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Source Code Link
                    </label>
                    <input
                      type="url"
                      value={formData.sourceCode}
                      onChange={(e) =>
                        setFormData({ ...formData, sourceCode: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="https://github.com/username/project"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Project Image
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="relative">
                      <div
                        onClick={triggerFileInput}
                        className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors ${
                          imagePreview ? 'border-transparent' : 'border-gray-300 dark:border-gray-600 p-4'
                        }`}
                      >
                        {imagePreview ? (
                          <>
                            <div className="relative w-full h-48 rounded-lg overflow-hidden">
                              <Image
                                src={imagePreview}
                                alt="Preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage();
                              }}
                              className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-sm"
                            >
                              <Trash2 size={18} className="text-red-600" />
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="text-gray-400 mb-2">
                              <ImageIcon size={24} />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 text-center">
                              Click to upload an image or drag and drop
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                              PNG, JPG, GIF up to 5MB
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full flex items-center"
                        >
                          #{tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Enter tags separated by comma or enter"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Press comma or enter to add tags
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="Planned">Planned</option>
                        <option value="Ongoing">Active</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Progress (%)
                      </label>
                      <input
                        type="range"
                        value={formData.progress}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            progress: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        min="0"
                        max="100"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0%</span>
                        <span>{formData.progress}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={isEditing ? handleUpdateProject : handleCreateProject}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!formData.title.trim()}
                >
                  {isEditing ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}