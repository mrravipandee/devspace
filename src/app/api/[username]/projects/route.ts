import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Project from '@/models/Project';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await dbConnect();

    const { username } = await params;
    
    // Find user by username
    const user = await User.findOne({ username }).select('_id');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

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

  } catch (error) {
    console.error('Projects API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
