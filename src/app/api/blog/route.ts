import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";

// GET - Fetch all blog posts
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Get blog posts with pagination
    const posts = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Blog.countDocuments(query);

    // Get blog statistics
    const stats = await Blog.aggregate([
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          totalViews: { $sum: { $ifNull: ['$views', 0] } },
          avgViews: { $avg: { $ifNull: ['$views', 0] } }
        }
      }
    ]);

    const blogStats = {
      total: total,
      totalViews: stats[0]?.totalViews || 0,
      avgViews: Math.round(stats[0]?.avgViews || 0),
      recentPosts: posts.length
    };

    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        stats: blogStats
      }
    });

  } catch (error) {
    console.error("Blog posts fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.content || !body.excerpt) {
      return NextResponse.json(
        { success: false, error: "Title, content, and excerpt are required" },
        { status: 400 }
      );
    }

    // Create new blog post
    const blogPost = new Blog({
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      featureImage: body.image || "",
      tags: body.tags || [],
      views: 0,
      published: true
    });

    const savedPost = await blogPost.save();

    return NextResponse.json({
      success: true,
      data: savedPost,
      message: "Blog post created successfully"
    });

  } catch (error) {
    console.error("Blog post creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}

// PUT - Update blog post
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Blog post ID is required" },
        { status: 400 }
      );
    }

    const updatedPost = await Blog.findByIdAndUpdate(
      body.id,
      {
        title: body.title,
        content: body.content,
        excerpt: body.excerpt,
        featureImage: body.image,
        tags: body.tags
      },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedPost,
      message: "Blog post updated successfully"
    });

  } catch (error) {
    console.error("Blog post update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog post
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Blog post ID is required" },
        { status: 400 }
      );
    }

    const deletedPost = await Blog.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully"
    });

  } catch (error) {
    console.error("Blog post deletion error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
