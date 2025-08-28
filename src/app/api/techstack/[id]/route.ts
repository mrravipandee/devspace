import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import TechStack from '@/models/TechStack';
import { getUserFromToken } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // Verify authentication
    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { name, category, proficiency, icon, yearsOfExperience, lastUsed, projects, description } = await req.json();

    // Validate required fields
    if (!name || !category || !proficiency || yearsOfExperience === undefined || !lastUsed) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find techstack and verify ownership
    const techStack = await TechStack.findOne({ _id: id, userId: user._id });
    if (!techStack) {
      return NextResponse.json(
        { error: 'Technology not found' },
        { status: 404 }
      );
    }

    // Update techstack
    techStack.name = name;
    techStack.category = category;
    techStack.proficiency = proficiency;
    techStack.icon = icon || '';
    techStack.yearsOfExperience = yearsOfExperience;
    techStack.lastUsed = new Date(lastUsed);
    techStack.projects = projects || [];
    techStack.description = description || '';

    await techStack.save();

    return NextResponse.json({
      success: true,
      data: {
        id: techStack._id,
        name: techStack.name,
        category: techStack.category,
        proficiency: techStack.proficiency,
        icon: techStack.icon,
        yearsOfExperience: techStack.yearsOfExperience,
        lastUsed: techStack.lastUsed,
        projects: techStack.projects,
        description: techStack.description,
        createdAt: techStack.createdAt
      }
    });

  } catch (error) {
    console.error('Update techstack error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // Verify authentication
    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Find techstack and verify ownership
    const techStack = await TechStack.findOne({ _id: id, userId: user._id });
    if (!techStack) {
      return NextResponse.json(
        { error: 'Technology not found' },
        { status: 404 }
      );
    }

    await TechStack.deleteOne({ _id: id });

    return NextResponse.json({
      success: true,
      message: 'Technology deleted successfully'
    });

  } catch (error) {
    console.error('Delete techstack error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
