import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Project from '@/models/Project';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    await dbConnect();
    
    const { username } = params;
    
    // Find user by username
    const user = await User.findOne({ username });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get user's projects
    const projects = await Project.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();
    
    // Format projects for public API
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
    
    return NextResponse.json({
      success: true,
      data: formattedProjects
    });
    
  } catch (error) {
    console.error('Projects API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
