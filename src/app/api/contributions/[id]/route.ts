import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Contribution from '@/models/Contribution';
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
    const { 
      projectName, 
      projectUrl, 
      description, 
      contributionType, 
      pullRequestUrl, 
      stars, 
      forks, 
      technologies, 
      date, 
      projectLogo 
    } = await req.json();

    // Validate required fields
    if (!projectName || !projectUrl || !description || !contributionType || !pullRequestUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate contribution type
    const validTypes = ['bug-fix', 'feature', 'documentation', 'translation', 'other'];
    if (!validTypes.includes(contributionType)) {
      return NextResponse.json(
        { error: 'Invalid contribution type' },
        { status: 400 }
      );
    }

    // Find contribution and verify ownership
    const contribution = await Contribution.findOne({ _id: id, userId: user._id });
    if (!contribution) {
      return NextResponse.json(
        { error: 'Contribution not found' },
        { status: 404 }
      );
    }

    // Update contribution
    contribution.projectName = projectName;
    contribution.projectUrl = projectUrl;
    contribution.description = description;
    contribution.contributionType = contributionType;
    contribution.pullRequestUrl = pullRequestUrl;
    contribution.stars = stars || 0;
    contribution.forks = forks || 0;
    contribution.technologies = technologies || [];
    contribution.date = date || new Date();
    contribution.projectLogo = projectLogo || '';

    await contribution.save();

    return NextResponse.json({
      success: true,
      data: {
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
        createdAt: contribution.createdAt
      }
    });

  } catch (error) {
    console.error('Update contribution error:', error);
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

    // Find contribution and verify ownership
    const contribution = await Contribution.findOne({ _id: id, userId: user._id });
    if (!contribution) {
      return NextResponse.json(
        { error: 'Contribution not found' },
        { status: 404 }
      );
    }

    await Contribution.deleteOne({ _id: id });

    return NextResponse.json({
      success: true,
      message: 'Contribution deleted successfully'
    });

  } catch (error) {
    console.error('Delete contribution error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
