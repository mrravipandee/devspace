import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Blog from '@/models/Blog';

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
    
    // Get all blog posts (since Blog model doesn't have userId field)
    const blogPosts = await Blog.find()
      .sort({ createdAt: -1 })
      .lean();
    
    // Format blog posts for public API
    const formattedPosts = blogPosts.map(post => ({
      id: post._id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      featureImage: post.featureImage,
      tags: post.tags,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedPosts
    });
    
  } catch (error) {
    console.error('Blog API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
