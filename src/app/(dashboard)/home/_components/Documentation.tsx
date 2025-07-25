"use client";
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function Documentation() {
  const [activeTab, setActiveTab] = useState(1);

  const docs = [
    {
      id: 1,
      title: "Getting Started",
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800">How to Use This API</h3>
          <p className="text-gray-600">
            Transform your <span className="font-semibold text-blue-600">static portfolio</span> into a dynamic one with just API calls.
            No backend required - just fetch data from our API endpoint.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-2">Key Benefits:</h4>
            <ul className="list-disc pl-5 space-y-1 text-blue-700">
              <li><span className="font-semibold">Real-time updates</span> without redeploying</li>
              <li><span className="font-semibold">Centralized content</span> management</li>
              <li><span className="font-semibold">Performance analytics</span> built-in</li>
            </ul>
          </div>
        </div>
      ),
      timelineContent: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">1</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Authenticate</h4>
              <p className="text-gray-600 text-sm">Login with DevSpace credentials</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">2</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Get API Key</h4>
              <p className="text-gray-600 text-sm">Generate your unique endpoint</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "API Implementation",
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800">Basic Fetch Example</h3>
          <p className="text-gray-600">
            Add this code to your portfolio to <span className="font-semibold text-blue-600">fetch data dynamically</span>:
          </p>
          
          <SyntaxHighlighter 
            language="javascript" 
            style={atomDark}
            customStyle={{ borderRadius: '0.5rem', fontSize: '0.9rem' }}
          >
            {`import { useEffect, useState } from 'react';

function Portfolio() {
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://api.devspace.com/v1/YOUR_USERNAME');
        const data = await res.json();
        setProjects(data.projects);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
}`}
          </SyntaxHighlighter>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <h4 className="font-medium text-yellow-800 mb-2">Pro Tip:</h4>
            <p className="text-yellow-700">
              For better performance, implement <span className="font-semibold">client-side caching</span> using localStorage or SWR.
            </p>
          </div>
        </div>
      ),
      timelineContent: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-bold text-sm">1</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Create Component</h4>
              <p className="text-gray-600 text-sm">Set up state for your data</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-bold text-sm">2</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Fetch Data</h4>
              <p className="text-gray-600 text-sm">Use useEffect to call API</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Live Demo",
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800">Example Output</h3>
          <p className="text-gray-600">
            Here's how your <span className="font-semibold text-blue-600">dynamic data</span> will appear:
          </p>
          
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="p-4 border-b bg-gray-50">
              <h4 className="font-medium">My Projects</h4>
            </div>
            <div className="divide-y">
              <div className="p-4">
                <h4 className="font-medium">E-Commerce App</h4>
                <p className="text-gray-600 text-sm mt-1">Full-stack e-commerce platform</p>
                <div className="flex gap-2 mt-3">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">React</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Node.js</span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">MongoDB</span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-medium">Portfolio Site</h4>
                <p className="text-gray-600 text-sm mt-1">Personal developer portfolio</p>
                <div className="flex gap-2 mt-3">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Next.js</span>
                  <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded">Tailwind</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-2">Snapshot:</h4>
            <img 
              src="/portfolio-snapshot.png" 
              alt="Portfolio Snapshot"
              className="rounded border shadow-sm w-full max-w-md"
            />
            <p className="text-gray-600 text-sm mt-2">Example of dynamic portfolio using our API</p>
          </div>
        </div>
      ),
      timelineContent: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">1</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Project Cards</h4>
              <p className="text-gray-600 text-sm">Dynamic project display</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">2</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Tech Tags</h4>
              <p className="text-gray-600 text-sm">Automatically generated</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Error Handling",
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800">Essential Error Handling</h3>
          <p className="text-gray-600">
            Proper error handling ensures your portfolio <span className="font-semibold text-blue-600">degrades gracefully</span> when API calls fail:
          </p>
          
          <SyntaxHighlighter 
            language="javascript" 
            style={atomDark}
            customStyle={{ borderRadius: '0.5rem', fontSize: '0.9rem' }}
          >
            {`async function fetchPortfolio() {
  try {
    const res = await fetch('API_ENDPOINT');
    
    if (!res.ok) {
      throw new Error(\`HTTP error! Status: \${res.status}\`);
    }
    
    const data = await res.json();
    return data;
    
  } catch (err) {
    console.error('Fetch error:', err);
    // Fallback to local data or cached version
    return getCachedData();
  }
}`}
          </SyntaxHighlighter>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h4 className="font-medium text-red-800 mb-2">Critical Errors to Handle:</h4>
            <ul className="list-disc pl-5 space-y-1 text-red-700">
              <li><span className="font-semibold">Network failures</span> - Show offline message</li>
              <li><span className="font-semibold">Rate limiting</span> - Implement retry logic</li>
              <li><span className="font-semibold">Invalid data</span> - Type checking with PropTypes</li>
            </ul>
          </div>
        </div>
      ),
      timelineContent: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 font-bold text-sm">1</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Try/Catch</h4>
              <p className="text-gray-600 text-sm">Wrap API calls</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 font-bold text-sm">2</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Fallbacks</h4>
              <p className="text-gray-600 text-sm">Implement cached data</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "API Reference",
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800">Complete API Reference</h3>
          <p className="text-gray-600">
            Understand the <span className="font-semibold text-blue-600">data structure</span> returned by our API:
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-2">Base Endpoint:</h4>
            <div className="p-3 bg-gray-800 rounded text-gray-100 font-mono text-sm overflow-x-auto">
              GET https://api.devspace.com/v1/&#123;username&#125;
            </div>
          </div>
          
          <SyntaxHighlighter 
            language="json" 
            style={atomDark}
            customStyle={{ borderRadius: '0.5rem', fontSize: '0.9rem' }}
            showLineNumbers
          >
            {`{
  "user": {
    "name": "Your Name",
    "bio": "Short bio...",
    "avatar": "https://...",
    "socialLinks": {
      "github": "...",
      "twitter": "..."
    }
  },
  "projects": [
    {
      "id": "proj_abc123",
      "title": "Project Name",
      "description": "Project description...",
      "image": "https://...",
      "tags": ["React", "Node"],
      "links": {
        "demo": "https://...",
        "code": "https://..."
      },
      "createdAt": "2023-01-01T00:00:00Z"
    }
  ],
  "skills": [
    {
      "name": "JavaScript",
      "level": "advanced",
      "icon": "js"
    }
  ]
}`}
          </SyntaxHighlighter>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h4 className="font-medium text-green-800 mb-2">Response Fields:</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <li><span className="font-mono bg-gray-100 px-1 rounded">projects[]</span> - Your portfolio projects</li>
              <li><span className="font-mono bg-gray-100 px-1 rounded">skills[]</span> - Technical skills list</li>
              <li><span className="font-mono bg-gray-100 px-1 rounded">meta.stats</span> - Visitor analytics</li>
              <li><span className="font-mono bg-gray-100 px-1 rounded">user.socialLinks</span> - Social media profiles</li>
            </ul>
          </div>
        </div>
      ),
      timelineContent: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-sm">1</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">User Data</h4>
              <p className="text-gray-600 text-sm">Personal information</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-sm">2</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Projects</h4>
              <p className="text-gray-600 text-sm">Portfolio items</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          DevSpace Portfolio API Documentation
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Transform your static portfolio into a dynamic showcase with our simple API
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Timeline Navigation (30%) */}
        <div className="lg:w-1/3">
          <div className="sticky top-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Documentation Guide</h2>
              
              <div className="relative pl-8 space-y-8">
                {/* Vertical line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                {docs.map((doc) => (
                  <div 
                    key={doc.id}
                    className={`relative cursor-pointer transition-all ${activeTab === doc.id ? 'scale-[1.02]' : 'opacity-80 hover:opacity-100'}`}
                    onClick={() => setActiveTab(doc.id)}
                  >
                    <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${activeTab === doc.id ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100 border-2 border-white'}`}>
                      <span className={`font-bold ${activeTab === doc.id ? 'text-blue-600' : 'text-gray-600'}`}>
                        {doc.id}
                      </span>
                    </div>
                    <div className="ml-10">
                      <h3 className={`font-semibold ${activeTab === doc.id ? 'text-blue-600' : 'text-gray-700'}`}>
                        {doc.title}
                      </h3>
                      {activeTab === doc.id && doc.timelineContent}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile tabs */}
            <div className="lg:hidden mt-6 overflow-x-auto">
              <div className="flex space-x-2 pb-2">
                {docs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setActiveTab(doc.id)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm ${activeTab === doc.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                  >
                    {doc.id}. {doc.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Documentation Content (70%) */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            {docs.find((doc) => doc.id === activeTab)?.content}
          </div>

          {/* Mobile navigation */}
          <div className="lg:hidden flex justify-between mt-6">
            <button
              onClick={() => setActiveTab(Math.max(1, activeTab - 1))}
              disabled={activeTab === 1}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <button
              onClick={() => setActiveTab(Math.min(docs.length, activeTab + 1))}
              disabled={activeTab === docs.length}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}