import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Contribution from '@/models/Contribution';
import { getUserFromToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
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

    const contributions = await Contribution.find({ userId: user._id })
      .sort({ date: -1 });
    
    return NextResponse.json({
      success: true,
      data: contributions.map(contribution => ({
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
      }))
    });

  } catch (error) {
    console.error('Contributions API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const contribution = new Contribution({
      userId: user._id,
      projectName,
      projectUrl,
      description,
      contributionType,
      pullRequestUrl,
      stars: stars || 0,
      forks: forks || 0,
      technologies: technologies || [],
      date: date || new Date(),
      projectLogo: projectLogo || ''
    });

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
    console.error('Create contribution error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
