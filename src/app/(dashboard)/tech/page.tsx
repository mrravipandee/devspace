"use client";

import { useRef, useState } from 'react';
import SmallCards from "@/components/SmallCards";
import { PlusCircle, Trash2, Edit, X, Code, Cpu, Database, Cloud, Layers, Smartphone, ImageIcon } from "lucide-react";
import Image from "next/image";

type TechItem = {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'other';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  icon: string;
  yearsOfExperience: number;
  lastUsed: string;
  projects: string[];
};

export default function TechStackPage() {
  const [techStack, setTechStack] = useState<TechItem[]>([
    {
      id: '1',
      name: 'React',
      category: 'frontend',
      proficiency: 'expert',
      icon: '/react-icon.png',
      yearsOfExperience: 5,
      lastUsed: '2025-06-01',
      projects: ['Portfolio', 'E-commerce', 'Admin Dashboard']
    },
    {
      id: '2',
      name: 'Node.js',
      category: 'backend',
      proficiency: 'advanced',
      icon: '/nodejs-icon.png',
      yearsOfExperience: 4,
      lastUsed: '2025-05-15',
      projects: ['API Service', 'Real-time Chat']
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTech, setCurrentTech] = useState<TechItem | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateNew = () => {
    setCurrentTech({
      id: '',
      name: '',
      category: 'frontend',
      proficiency: 'intermediate',
      icon: '',
      yearsOfExperience: 1,
      lastUsed: new Date().toISOString().split('T')[0],
      projects: []
    });
    setIconPreview(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tech: TechItem) => {
    setCurrentTech(tech);
    setIconPreview(tech.icon);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this technology?')) {
      setTechStack(techStack.filter(item => item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newTechData = {
      id: currentTech?.id || Date.now().toString(),
      name: formData.get('name') as string,
      category: formData.get('category') as TechItem['category'],
      proficiency: formData.get('proficiency') as TechItem['proficiency'],
      icon: iconPreview || '/tech-default-icon.png',
      yearsOfExperience: Number(formData.get('yearsOfExperience')),
      lastUsed: formData.get('lastUsed') as string,
      projects: (formData.get('projects') as string).split(',').map(proj => proj.trim()),
    };

    if (currentTech?.id) {
      // Update existing tech
      setTechStack(techStack.map(item => 
        item.id === currentTech.id ? newTechData : item
      ));
    } else {
      // Add new tech
      setTechStack([...techStack, newTechData]);
    }

    setIsModalOpen(false);
    setCurrentTech(null);
    setIconPreview(null);
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getCategoryIcon = (category: TechItem['category']) => {
    switch (category) {
      case 'frontend': return <Code className="w-5 h-5 text-blue-500" />;
      case 'backend': return <Cpu className="w-5 h-5 text-green-500" />;
      case 'database': return <Database className="w-5 h-5 text-orange-500" />;
      case 'devops': return <Cloud className="w-5 h-5 text-purple-500" />;
      case 'mobile': return <Smartphone className="w-5 h-5 text-pink-500" />;
      case 'other': return <Layers className="w-5 h-5 text-gray-500" />;
      default: return <Layers className="w-5 h-5 text-gray-500" />;
    }
  };

  const getProficiencyColor = (proficiency: TechItem['proficiency']) => {
    switch (proficiency) {
      case 'beginner': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-green-100 text-green-800';
      case 'advanced': return 'bg-yellow-100 text-yellow-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen">
      <SmallCards />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-primaryText dark:text-background">My Tech Stack</h2>
            <p className="text-secondaryText mt-2 max-w-2xl">
              The technologies, tools, and frameworks I work with regularly.
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="bg-primary text-white px-5 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            <PlusCircle className="w-5 h-5" />
            Add Technology
          </button>
        </div>

        {/* Tech Stack List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map(tech => (
            <div key={tech.id} className="bg-white dark:bg-cardDark rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {tech.icon && (
                      <div className="relative w-10 h-10">
                        <Image
                          src={tech.icon}
                          alt={tech.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-primaryText dark:text-background">{tech.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(tech)}
                      className="text-secondaryText hover:text-primary p-1 rounded-full hover:bg-gray-100"
                      title="Edit technology"
                      aria-label="Edit technology"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(tech.id)}
                      className="text-secondaryText hover:text-primary p-1 rounded-full hover:bg-gray-100"
                      title="Delete technology"
                      aria-label="Delete technology"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-secondaryText/80 mb-3">
                  {getCategoryIcon(tech.category)}
                  <span className="capitalize">{tech.category}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getProficiencyColor(tech.proficiency)}`}>
                    {tech.proficiency}
                  </span>
                  <span className="text-sm text-secondaryText/80">
                    {tech.yearsOfExperience} {tech.yearsOfExperience === 1 ? 'year' : 'years'} experience
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-secondaryText mb-1">Last used: {tech.lastUsed}</p>
                  <div className="flex flex-wrap gap-1">
                    {tech.projects.map(project => (
                      <span 
                        key={project} 
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {project}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {techStack.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto max-w-md">
              <Code className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-primaryText mb-2">No technologies added yet</h3>
              <p className="text-secondaryText mb-6">Start building your tech stack by adding technologies you work with.</p>
              <button
                onClick={handleCreateNew}
                className="bg-primary text-white px-5 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-primary/90 transition-colors mx-auto"
              >
                <PlusCircle className="w-5 h-5" />
                Add First Technology
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Tech Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primaryText">
                  {currentTech?.id ? 'Edit Technology' : 'Add New Technology'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentTech(null);
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name*</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={currentTech?.name || ''}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        placeholder="Technology name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category*</label>
                      <select
                        name="category"
                        defaultValue={currentTech?.category || 'frontend'}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="database">Database</option>
                        <option value="devops">DevOps</option>
                        <option value="mobile">Mobile</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Proficiency*</label>
                      <select
                        name="proficiency"
                        defaultValue={currentTech?.proficiency || 'intermediate'}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience*</label>
                      <input
                        type="number"
                        name="yearsOfExperience"
                        min="0"
                        max="50"
                        defaultValue={currentTech?.yearsOfExperience || 1}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Used Date*</label>
                    <input
                      type="date"
                      name="lastUsed"
                      defaultValue={currentTech?.lastUsed || ''}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Projects (comma separated)</label>
                    <input
                      type="text"
                      name="projects"
                      defaultValue={currentTech?.projects.join(', ') || ''}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Project 1, Project 2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Technology Icon</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleIconChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="space-y-2">
                      <div
                        onClick={triggerFileInput}
                        className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                          iconPreview ? 'border-transparent' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {iconPreview ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={iconPreview}
                              alt="Preview"
                              fill
                              className="object-contain p-4 rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIconPreview(null);
                              }}
                              className="absolute top-3 right-3 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-sm"
                              aria-label="Remove icon"
                            >
                              <X size={18} className="text-red-600" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center p-4">
                            <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">Click to upload an icon</p>
                            <p className="text-xs text-gray-400 mt-1">Recommended: 128x128px transparent PNG</p>
                          </div>
                        )}
                      </div>
                      {currentTech?.icon && !iconPreview && (
                        <p className="text-sm text-gray-500">Current icon will be kept if no new icon is selected</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setCurrentTech(null);
                    }}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    {currentTech?.id ? 'Update Technology' : 'Add Technology'}
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