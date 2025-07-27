
type Project = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  link: string;
};

type ProjectsSectionProps = {
  theme: {
    bg: string;
    text: string;
    primary: string;
    secondary: string;
  };
};

const ProjectsSection = ({ theme }: ProjectsSectionProps) => {
  const projects: Project[] = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'A full-featured online store with cart functionality, user authentication, and payment processing.',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      link: '#',
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'A productivity application for organizing tasks with drag-and-drop functionality and team collaboration.',
      tags: ['TypeScript', 'React', 'Firebase', 'Tailwind CSS'],
      link: '#',
    },
    {
      id: 3,
      title: 'Weather Dashboard',
      description: 'Real-time weather information with forecasts, maps, and historical data visualization.',
      tags: ['JavaScript', 'API Integration', 'Chart.js'],
      link: '#',
    },
  ];

  return (
    <section id="projects" className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-center">My Projects</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className={`rounded-lg overflow-hidden shadow-lg ${theme.bg === 'bg-gray-900' ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="h-48 bg-gray-300"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="mb-4">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className={`text-xs px-2 py-1 rounded ${theme.primary} text-white`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <a 
                href={project.link} 
                className={`inline-block px-4 py-2 rounded ${theme.secondary} text-white hover:opacity-90 transition-opacity`}
              >
                View Project
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;