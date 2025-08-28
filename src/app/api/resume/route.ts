import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Resume from '@/models/Resume';
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

    const resume = await Resume.findOne({ userId: user._id, isActive: true })
      .sort({ uploadDate: -1 });
    
    return NextResponse.json({
      success: true,
      data: resume ? {
        id: resume._id,
        fileName: resume.fileName,
        fileUrl: resume.fileUrl,
        fileSize: resume.fileSize,
        fileType: resume.fileType,
        uploadDate: resume.uploadDate,
        isActive: resume.isActive
      } : null
    });

  } catch (error) {
    console.error('Resume API error:', error);
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

    const { fileName, fileUrl, fileSize, fileType } = await req.json();

    // Validate required fields
    if (!fileName || !fileUrl || fileSize === undefined || !fileType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type
    if (fileType !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (fileSize > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be under 5MB' },
        { status: 400 }
      );
    }

    // Deactivate any existing active resume
    await Resume.updateMany(
      { userId: user._id, isActive: true },
      { isActive: false }
    );

    // Create new resume
    const resume = new Resume({
      userId: user._id,
      fileName,
      fileUrl,
      fileSize,
      fileType,
      isActive: true
    });

    await resume.save();

    return NextResponse.json({
      success: true,
      data: {
        id: resume._id,
        fileName: resume.fileName,
        fileUrl: resume.fileUrl,
        fileSize: resume.fileSize,
        fileType: resume.fileType,
        uploadDate: resume.uploadDate,
        isActive: resume.isActive
      }
    });

  } catch (error) {
    console.error('Upload resume error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
