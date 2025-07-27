
type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
};

type BlogSectionProps = {
  theme: {
    bg: string;
    text: string;
    primary: string;
    secondary: string;
  };
};

const BlogSection = ({ theme }: BlogSectionProps) => {
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Getting Started with React and TypeScript',
      excerpt: 'Learn how to set up a new project with React and TypeScript, and understand the benefits of using TypeScript in your React applications.',
      date: 'May 15, 2023',
      readTime: '5 min read',
      tags: ['React', 'TypeScript', 'Frontend'],
    },
    {
      id: 2,
      title: 'Mastering Tailwind CSS for Rapid UI Development',
      excerpt: 'Discover how Tailwind CSS can speed up your development workflow and create beautiful, responsive designs without leaving your HTML.',
      date: 'April 28, 2023',
      readTime: '7 min read',
      tags: ['Tailwind CSS', 'CSS', 'Design'],
    },
    {
      id: 3,
      title: 'State Management in Modern React Applications',
      excerpt: 'Comparing different state management solutions for React applications including Context API, Redux, and Zustand.',
      date: 'March 10, 2023',
      readTime: '10 min read',
      tags: ['React', 'State Management', 'Redux'],
    },
  ];

  return (
    <section id="blog" className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">My Blog</h2>
        <a 
          href="#" 
          className={`px-4 py-2 rounded ${theme.primary} text-white hover:opacity-90 transition-opacity`}
        >
          View All Posts
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <div 
            key={post.id} 
            className={`rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${theme.bg === 'bg-gray-900' ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <span className={`text-sm ${theme.text} opacity-70`}>{post.date}</span>
                <span className={`text-xs px-2 py-1 rounded ${theme.secondary} text-white`}>
                  {post.readTime}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-3">{post.title}</h3>
              <p className="mb-4">{post.excerpt}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className={`text-xs px-2 py-1 rounded ${theme.primary} text-white`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <a 
                href="#" 
                className={`inline-block font-medium hover:underline ${theme.text}`}
              >
                Read more →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;