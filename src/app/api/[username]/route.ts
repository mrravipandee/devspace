import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey } from '@/lib/apiKeyAuth';
import dbConnect from '@/lib/dbConnect';

import Project from '@/models/Project';
import Blog from '@/models/Blog';
import Achievement from '@/models/Achievement';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await dbConnect();

    // Authenticate API key
    const authResult = await authenticateApiKey(req);
    if (!authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    const { username } = await params;
    
    // Verify the username matches the authenticated user
    if (authResult.user.username !== username) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Get the path to determine what data to return
    const url = new URL(req.url);
    const path = url.pathname.split('/').slice(3); // Remove /api/username

    if (path.length === 0) {
      // Return user profile
      return NextResponse.json({
        success: true,
        data: {
          profile: {
            id: authResult.user._id,
            username: authResult.user.username,
            fullName: authResult.user.fullName,
            bio: authResult.user.bio,
            profileImage: authResult.user.profileImage,
            location: authResult.user.location,
            availableForWork: authResult.user.availableForWork,
            socialHandles: authResult.user.socialHandles,
            usefulLinks: authResult.user.usefulLinks,
            profileCompleted: authResult.user.profileCompleted
          }
        }
      });
    }

    const endpoint = path[0];

    switch (endpoint) {
      case 'profile':
        return NextResponse.json({
          success: true,
          data: {
            id: authResult.user._id,
            username: authResult.user.username,
            fullName: authResult.user.fullName,
            bio: authResult.user.bio,
            profileImage: authResult.user.profileImage,
            location: authResult.user.location,
            availableForWork: authResult.user.availableForWork,
            socialHandles: authResult.user.socialHandles,
            usefulLinks: authResult.user.usefulLinks,
            profileCompleted: authResult.user.profileCompleted
          }
        });

      case 'projects':
        const projects = await Project.find({ userId: authResult.user._id })
          .sort({ createdAt: -1 });
        
        return NextResponse.json({
          success: true,
          data: projects.map(project => ({
            id: project._id,
            title: project.title,
            description: project.description,
            image: project.image,
            technologies: project.technologies,
            githubUrl: project.githubUrl,
            liveUrl: project.liveUrl,
            createdAt: project.createdAt
          }))
        });

      case 'blog':
        const blogs = await Blog.find({ userId: authResult.user._id })
          .sort({ createdAt: -1 });
        
        return NextResponse.json({
          success: true,
          data: blogs.map(blog => ({
            id: blog._id,
            title: blog.title,
            content: blog.content,
            image: blog.image,
            tags: blog.tags,
            createdAt: blog.createdAt
          }))
        });

      case 'achievements':
        const achievements = await Achievement.find({ userId: authResult.user._id })
          .sort({ createdAt: -1 });
        
        return NextResponse.json({
          success: true,
          data: achievements.map(achievement => ({
            id: achievement._id,
            title: achievement.title,
            description: achievement.description,
            image: achievement.image,
            date: achievement.date,
            createdAt: achievement.createdAt
          }))
        });

      default:
        return NextResponse.json(
          { error: 'Endpoint not found' },
          { status: 404 }
        );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
