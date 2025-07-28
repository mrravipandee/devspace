"use client";

import { useRef, useState } from 'react';
import SmallCards from "@/components/SmallCards";
import { PlusCircle, Trash2, Edit, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

type BlogPost = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  tags: string[];
  publishedDate: string;
  lastUpdated?: string;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Getting Started with Next.js',
      content: 'This is a full blog post content about Next.js...',
      excerpt: 'Learn the basics of Next.js and how to set up your first project',
      image: '/blog-placeholder.jpg',
      tags: ['Next.js', 'React', 'Web Development'],
      publishedDate: '2025-01-01',
    },
    {
      id: '2',
      title: 'Advanced TypeScript Patterns',
      content: 'Deep dive into advanced TypeScript concepts...',
      excerpt: 'Explore powerful TypeScript patterns for better code',
      image: '/blog-placeholder.jpg',
      tags: ['TypeScript', 'Programming'],
      publishedDate: '2025-01-15',
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateNew = () => {
    setCurrentPost({
      id: '',
      title: '',
      content: '',
      excerpt: '',
      image: '',
      tags: [],
      publishedDate: new Date().toISOString().split('T')[0]
    });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setImagePreview(post.image);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(post => post.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newPostData = {
      id: currentPost?.id || Date.now().toString(),
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      excerpt: formData.get('excerpt') as string,
      image: imagePreview || '/blog-placeholder.jpg',
      tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()),
      publishedDate: currentPost?.publishedDate || new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    if (currentPost?.id) {
      // Update existing post
      setPosts(posts.map(post => post.id === currentPost.id ? newPostData : post));
    } else {
      // Add new post
      setPosts([...posts, newPostData]);
    }

    setIsModalOpen(false);
    setCurrentPost(null);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <SmallCards />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">My Blog</h2>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Welcome to my blog! Here you&apos;ll find articles on web development, design, and more.
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm hover:shadow-md"
          >
            <PlusCircle className="w-5 h-5" />
            Create New Post
          </button>
        </div>

        {/* Blog Posts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {post.image && (
                  <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100"
                        title="Edit post"
                        aria-label="Edit post"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-gray-100"
                        title="Delete post"
                        aria-label="Delete post"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {post.lastUpdated ? `Updated: ${post.lastUpdated}` : `Published: ${post.publishedDate}`}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Read more →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto max-w-md">
              <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first blog post.</p>
              <button
                onClick={handleCreateNew}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-blue-700 transition-colors mx-auto"
              >
                <PlusCircle className="w-5 h-5" />
                Create First Post
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentPost?.id ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentPost(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title*</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={currentPost?.title || ''}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      placeholder="Enter post title"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt*</label>
                      <textarea
                        name="excerpt"
                        defaultValue={currentPost?.excerpt || ''}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        placeholder="Short description of your post"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                      <input
                        type="text"
                        name="tags"
                        defaultValue={currentPost?.tags.join(', ') || ''}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="web development, design, tutorial"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content*</label>
                    <textarea
                      name="content"
                      defaultValue={currentPost?.content || ''}
                      rows={8}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      placeholder="Write your post content here..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
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
                            <p className="text-xs text-gray-400 mt-1">Recommended size: 1200x630px</p>
                          </div>
                        )}
                      </div>
                      {currentPost?.image && !imagePreview && (
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
                      setCurrentPost(null);
                    }}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    {currentPost?.id ? 'Update Post' : 'Publish Post'}
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