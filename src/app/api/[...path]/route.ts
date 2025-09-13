import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Project from '@/models/Project';
import Blog from '@/models/Blog';
import Achievement from '@/models/Achievement';
import TechStack from '@/models/TechStack';
import Contribution from '@/models/Contribution';
import Resume from '@/models/Resume';
import { Types } from 'mongoose';

interface RouteParams {
  params: {
    path: string[];
  };
}

// Base interface for all documents
interface BaseDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// User profile interface
interface UserProfile {
  name: string;
  username: string;
  bio?: string;
  avatar?: string;
  social?: Record<string, string>;
  location?: string;
  website?: string;
  company?: string;
  jobTitle?: string;
  skills?: string[];
  createdAt: Date;
}

// Project interface
interface ProjectDocument extends BaseDocument {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  category: string;
  featured: boolean;
}

// Blog interface
interface BlogDocument extends BaseDocument {
  title: string;
  content: string;
  excerpt?: string;
  tags: string[];
  category: string;
  image?: string;
  publishedAt?: Date;
  readTime?: number;
  views: number;
  likes: number;
  status: 'draft' | 'published';
}

// Achievement interface
interface AchievementDocument extends BaseDocument {
  title: string;
  description: string;
  type: string;
  issuer?: string;
  date: Date;
  image?: string;
  url?: string;
  category: string;
}

// TechStack interface
interface TechStackDocument extends BaseDocument {
  name: string;
  category: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
  lastUsed?: Date;
  icon?: string;
  projects?: string[];
  description?: string;
}

// Contribution interface
interface ContributionDocument extends BaseDocument {
  projectName: string;
  projectUrl?: string;
  description: string;
  contributionType: string;
  pullRequestUrl?: string;
  stars?: number;
  forks?: number;
  technologies: string[];
  date: Date;
  projectLogo?: string;
}

// Resume interface
interface ResumeDocument extends BaseDocument {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadDate: Date;
  isActive: boolean;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await dbConnect();

    const path = params.path;
    const segments = Array.isArray(path) ? path : [path];

    if (!segments || segments.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid API path' }, { status: 400 });
    }

    const username = segments[0];
    const endpoint = segments[1]; // may be undefined

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // If no endpoint or profile
    if (!endpoint || endpoint === 'profile') {
      const userProfile: UserProfile = {
        name: user.name,
        username: user.username,
        bio: user.bio,
        avatar: user.avatar,
        social: user.social,
        location: user.location,
        website: user.website,
        company: user.company,
        jobTitle: user.jobTitle,
        skills: user.skills,
        createdAt: user.createdAt,
      };
      
      return NextResponse.json({ success: true, data: userProfile });
    }

    // Other endpoints
    switch (endpoint) {
      case 'projects': {
        const projects = await Project.find({ userId: user._id }).sort({ createdAt: -1 }).lean<ProjectDocument[]>();
        const formattedProjects = projects.map(p => ({
          id: p._id.toString(),
          title: p.title,
          description: p.description,
          technologies: p.technologies,
          githubUrl: p.githubUrl,
          liveUrl: p.liveUrl,
          image: p.image,
          category: p.category,
          featured: p.featured,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }));
        return NextResponse.json({ success: true, data: formattedProjects });
      }

      case 'blog': {
        const posts = await Blog.find({ userId: user._id, status: 'published' })
          .sort({ publishedAt: -1 })
          .lean<BlogDocument[]>();
        const formattedPosts = posts.map(p => ({
          id: p._id.toString(),
          title: p.title,
          content: p.content,
          excerpt: p.excerpt,
          tags: p.tags,
          category: p.category,
          image: p.image,
          publishedAt: p.publishedAt,
          readTime: p.readTime,
          views: p.views,
          likes: p.likes,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }));
        return NextResponse.json({ success: true, data: formattedPosts });
      }

      case 'achievements': {
        const achievements = await Achievement.find({ userId: user._id }).sort({ date: -1 }).lean<AchievementDocument[]>();
        const formatted = achievements.map(a => ({
          id: a._id.toString(),
          title: a.title,
          description: a.description,
          type: a.type,
          issuer: a.issuer,
          date: a.date,
          image: a.image,
          url: a.url,
          category: a.category,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
        }));
        return NextResponse.json({ success: true, data: formatted });
      }

      case 'techstack': {
        const tech = await TechStack.find({ userId: user._id }).sort({ yearsOfExperience: -1 }).lean<TechStackDocument[]>();
        const formatted = tech.map(t => ({
          id: t._id.toString(),
          name: t.name,
          category: t.category,
          proficiency: t.proficiency,
          yearsOfExperience: t.yearsOfExperience,
          lastUsed: t.lastUsed,
          icon: t.icon,
          projects: t.projects,
          description: t.description,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        }));
        return NextResponse.json({ success: true, data: formatted });
      }

      case 'contributions': {
        const contrib = await Contribution.find({ userId: user._id }).sort({ date: -1 }).lean<ContributionDocument[]>();
        const formatted = contrib.map(c => ({
          id: c._id.toString(),
          projectName: c.projectName,
          projectUrl: c.projectUrl,
          description: c.description,
          contributionType: c.contributionType,
          pullRequestUrl: c.pullRequestUrl,
          stars: c.stars,
          forks: c.forks,
          technologies: c.technologies,
          date: c.date,
          projectLogo: c.projectLogo,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        }));
        return NextResponse.json({ success: true, data: formatted });
      }

      case 'resume': {
        const resume = await Resume.findOne({ userId: user._id, isActive: true }).lean<ResumeDocument>();
        if (!resume) {
          return NextResponse.json({ success: true, data: null, message: 'No active resume found' });
        }
        return NextResponse.json({ success: true, data: {
          id: resume._id.toString(),
          fileName: resume.fileName,
          fileUrl: resume.fileUrl,
          fileSize: resume.fileSize,
          fileType: resume.fileType,
          uploadDate: resume.uploadDate,
          isActive: resume.isActive,
          createdAt: resume.createdAt,
          updatedAt: resume.updatedAt,
        }});
      }

      default:
        return NextResponse.json({ success: false, error: 'Endpoint not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('API catch-all error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}