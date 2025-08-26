import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';

import User from '@/models/User';
import Project from '@/models/Project';
import Blog from '@/models/Blog';
import Achievement from '@/models/Achievement';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await dbConnect();

    const { username } = await params;
    
    // Find user by username
    const user = await User.findOne({ username }).select('-password');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
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
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            bio: user.bio,
            profileImage: user.profileImage,
            location: user.location,
            availableForWork: user.availableForWork,
            socialHandles: user.socialHandles,
            usefulLinks: user.usefulLinks,
            profileCompleted: user.profileCompleted
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
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            bio: user.bio,
            profileImage: user.profileImage,
            location: user.location,
            availableForWork: user.availableForWork,
            socialHandles: user.socialHandles,
            usefulLinks: user.usefulLinks,
            profileCompleted: user.profileCompleted
          }
        });

      case 'projects':
        const projects = await Project.find({ userId: user._id })
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
        const blogs = await Blog.find({ userId: user._id })
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
        const achievements = await Achievement.find({ userId: user._id })
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
