"use client";

import { useState, useRef, useEffect } from 'react';
import SmallCards from "@/components/SmallCards";
import { PlusCircle, X, Image as ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  tags: string[];
  status: 'active' | 'inactive' | 'completed';
  members: number;
  progress: number;
  lastUpdated: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState<Omit<Project, 'id' | 'lastUpdated'>>({
    title: '',
    description: '',
    image: '/project-thumbnail.jpg',
    techStack: [],
    tags: [],
    status: 'active',
    members: 0,
    progress: 0,
  });
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample projects for demonstration
  useEffect(() => {
    setProjects([
      {
        id: '1',
        title: 'E-commerce Platform',
        description: 'A full-featured online shopping solution with payment integration',
        image: 'https://m.media-amazon.com/images/G/31/amazonservices/Blog/eCommerce_Platform.png',
        techStack: ['React', 'Node.js', 'MongoDB'],
        tags: ['ecommerce', 'shopping', 'webapp'],
        status: 'active',
        members: 5,
        progress: 75,
        lastUpdated: '2023-10-01',
      },
      {
        id: '2',
        title: 'Portfolio Website',
        description: 'Personal portfolio for creative professionals with gallery',
        image: 'https://miro.medium.com/v2/resize:fit:1123/1*6C702o6cpNyLm27WLdZyjg.png',
        techStack: ['Next.js', 'Tailwind CSS'],
        tags: ['portfolio', 'creative'],
        status: 'completed',
        members: 1,
        progress: 100,
        lastUpdated: '2023-09-15',
      },
      {
        id: '3',
        title: 'Task Management App',
        description: 'Collaborative task management with real-time updates',
        image: 'https://cdn.wedevs.com/uploads/2020/06/Why-you-need-a-task-manager-app.png',
        techStack: ['React', 'Firebase', 'Redux'],
        tags: ['productivity', 'collaboration'],
        status: 'active',
        members: 3,
        progress: 45,
        lastUpdated: '2023-10-15',
      },
    ]);
  }, []);

  const handleCreateProject = () => {
    const project: Project = {
      ...newProject,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setProjects([...projects, project]);
    setNewProject({
      title: '',
      description: '',
      image: '/project-thumbnail.jpg',
      techStack: [],
      tags: [],
      status: 'active',
      members: 0,
      progress: 0,
    });
    setImagePreview(null);
    setIsModalOpen(false);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (['Enter', ','].includes(e.key)) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !newProject.tags.includes(newTag)) {
        setNewProject({
          ...newProject,
          tags: [...newProject.tags, newTag],
        });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewProject({
      ...newProject,
      tags: newProject.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setNewProject({
          ...newProject,
          image: result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setNewProject({
      ...newProject,
      image: '/project-thumbnail.jpg',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SmallCards />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer hover:bg-primary/90 hover:duration-150 transition-all whitespace-nowrap"
          >
            Create New Project <PlusCircle size={18} />
          </button>
        </div>

        {/* Project List - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col h-full"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={project.image}
                  alt="Project Thumbnail"
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{project.title}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                      project.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : project.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Progress: {project.progress}%</span>
                    <span className="text-xs text-gray-500">{project.members} {project.members === 1 ? 'member' : 'members'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        #{tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button className="bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary/90 transition-colors flex-1 sm:flex-none">
                      View
                    </button>
                    <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm hover:bg-gray-300 transition-colors flex-1 sm:flex-none">
                      Edit
                    </button>
                    <button className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm hover:bg-red-200 transition-colors flex-1 sm:flex-none">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Create New Project</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Title*
                    </label>
                    <input
                      type="text"
                      value={newProject.title}
                      onChange={(e) =>
                        setNewProject({ ...newProject, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter project title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject({ ...newProject, description: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter project description"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tech Stack (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newProject.techStack.join(', ')}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          techStack: e.target.value.split(',').map(t => t.trim()),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        className={`border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors ${
                          imagePreview ? 'border-transparent' : 'border-gray-300 p-4'
                        }`}
                      >
                        {imagePreview ? (
                          <>
                            <div className="relative w-full h-48 rounded-md overflow-hidden">
                              <Image
                                src={imagePreview}
                                alt="Preview"
                                layout="fill"
                                objectFit="cover"
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
                            <span className="text-sm text-gray-600 text-center">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center"
                        >
                          #{tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-gray-500 hover:text-gray-700"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter tags separated by comma or enter"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Press comma or enter to add tags
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={newProject.status}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            status: e.target.value as 'active' | 'inactive' | 'completed',
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Members
                      </label>
                      <input
                        type="number"
                        value={newProject.members}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            members: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Progress (%)
                    </label>
                    <input
                      type="range"
                      value={newProject.progress}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          progress: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      min="0"
                      max="100"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span>{newProject.progress}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProject}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!newProject.title.trim()}
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}