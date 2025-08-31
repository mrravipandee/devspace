import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Project from '@/models/Project';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await dbConnect();
    
    const { username } = await params;
    
    // Find user by username
    const user = await User.findOne({ username });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get user's projects (where user is a member)
    const projects = await Project.find({ members: user._id })
      .sort({ createdAt: -1 })
      .lean();
    
    // Format projects for public API
    const formattedProjects = projects.map(project => ({
      id: project._id,
      title: project.title,
      description: project.description,
      image: project.image,
      tech: project.tech,
      tags: project.tags,
      status: project.status,
      progress: project.progress,
      liveLink: project.liveLink,
      sourceCode: project.sourceCode,
      projectLogo: project.projectLogo,
      techLogos: project.techLogos,
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
