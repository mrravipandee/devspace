import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Project from '@/models/Project';
import Blog from '@/models/Blog';
import Achievement from '@/models/Achievement';
import TechStack from '@/models/TechStack';
import Contribution from '@/models/Contribution';
import Resume from '@/models/Resume';

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> }
) {
  try {
    await dbConnect();
    
    const { path } = params;
    
    // Handle API subdomain format: api.devspacee.me/username/endpoint
    if (path.length >= 2) {
      const [username, endpoint] = path;
      
      // Find user by username
      const user = await User.findOne({ username });
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }
      
      // Route to appropriate endpoint
      switch (endpoint) {
        case 'profile':
          const profileData = {
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
            createdAt: user.createdAt
          };
          return NextResponse.json({ success: true, data: profileData });
          
        case 'projects':
          const projects = await Project.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .lean();
          const formattedProjects = projects.map(project => ({
            id: project._id,
            title: project.title,
            description: project.description,
            technologies: project.technologies,
            githubUrl: project.githubUrl,
            liveUrl: project.liveUrl,
            image: project.image,
            category: project.category,
            featured: project.featured,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt
          }));
          return NextResponse.json({ success: true, data: formattedProjects });
          
        case 'blog':
          const blogPosts = await Blog.find({ 
            userId: user._id,
            status: 'published'
          })
            .sort({ publishedAt: -1 })
            .lean();
          const formattedPosts = blogPosts.map(post => ({
            id: post._id,
            title: post.title,
            content: post.content,
            excerpt: post.excerpt,
            tags: post.tags,
            category: post.category,
            image: post.image,
            publishedAt: post.publishedAt,
            readTime: post.readTime,
            views: post.views,
            likes: post.likes,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
          }));
          return NextResponse.json({ success: true, data: formattedPosts });
          
        case 'achievements':
          const achievements = await Achievement.find({ userId: user._id })
            .sort({ date: -1 })
            .lean();
          const formattedAchievements = achievements.map(achievement => ({
            id: achievement._id,
            title: achievement.title,
            description: achievement.description,
            type: achievement.type,
            issuer: achievement.issuer,
            date: achievement.date,
            image: achievement.image,
            url: achievement.url,
            category: achievement.category,
            createdAt: achievement.createdAt,
            updatedAt: achievement.updatedAt
          }));
          return NextResponse.json({ success: true, data: formattedAchievements });
          
        case 'techstack':
          const techStack = await TechStack.find({ userId: user._id })
            .sort({ yearsOfExperience: -1 })
            .lean();
          const formattedTechStack = techStack.map(tech => ({
            id: tech._id,
            name: tech.name,
            category: tech.category,
            proficiency: tech.proficiency,
            yearsOfExperience: tech.yearsOfExperience,
            lastUsed: tech.lastUsed,
            icon: tech.icon,
            projects: tech.projects,
            description: tech.description,
            createdAt: tech.createdAt,
            updatedAt: tech.updatedAt
          }));
          return NextResponse.json({ success: true, data: formattedTechStack });
          
        case 'contributions':
          const contributions = await Contribution.find({ userId: user._id })
            .sort({ date: -1 })
            .lean();
          const formattedContributions = contributions.map(contribution => ({
            id: contribution._id,
            projectName: contribution.projectName,
            projectUrl: contribution.projectUrl,
            description: contribution.description,
            contributionType: contribution.contributionType,
            pullRequestUrl: contribution.pullRequestUrl,
            stars: contribution.stars,
            forks: contribution.forks,
            technologies: contribution.technologies,
            date: contribution.date,
            projectLogo: contribution.projectLogo,
            createdAt: contribution.createdAt,
            updatedAt: contribution.updatedAt
          }));
          return NextResponse.json({ success: true, data: formattedContributions });
          
        case 'resume':
          interface ResumeType {
            _id: string;
            fileName: string;
            fileUrl: string;
            fileSize: number;
            fileType: string;
            uploadDate: Date;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
          }

          const resume = await Resume.findOne({ 
            userId: user._id,
            isActive: true
          }).lean();

          if (!resume || Array.isArray(resume)) {
            return NextResponse.json({
              success: true,
              data: null,
              message: 'No active resume found'
            });
          }

          const r = resume as unknown as ResumeType;

          const formattedResume = {
            id: r._id,
            fileName: r.fileName,
            fileUrl: r.fileUrl,
            fileSize: r.fileSize,
            fileType: r.fileType,
            uploadDate: r.uploadDate,
            isActive: r.isActive,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
          };
          return NextResponse.json({ success: true, data: formattedResume });
          
        default:
          return NextResponse.json(
            { success: false, error: 'Endpoint not found' },
            { status: 404 }
          );
      }
    }
    
    // If only username is provided, return profile
    if (path.length === 1) {
      const username = path[0];
      const user = await User.findOne({ username });
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }
      
      const profileData = {
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
        createdAt: user.createdAt
      };
      
      return NextResponse.json({ success: true, data: profileData });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid API path' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('API catch-all error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
