import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";

// GET - Fetch all projects
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build query
    let query: any = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Get projects with pagination
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Project.countDocuments(query);

    // Get project statistics
    const stats = await Project.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const projectStats = {
      total: total,
      active: stats.find(s => s._id === "Ongoing")?.count || 0,
      completed: stats.find(s => s._id === "Completed")?.count || 0,
      planned: stats.find(s => s._id === "Planned")?.count || 0
    };

    return NextResponse.json({
      success: true,
      data: {
        projects,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        stats: projectStats
      }
    });

  } catch (error) {
    console.error("Projects fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description) {
      return NextResponse.json(
        { success: false, error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Create new project
    const project = new Project({
      title: body.title,
      description: body.description,
      image: body.image || "",
      tech: body.techStack || [],
      tags: body.tags || [],
      status: body.status || "Planned",
      progress: body.progress || 0,
      liveLink: body.liveLink || "",
      sourceCode: body.sourceCode || "",
      projectLogo: body.projectLogo || "",
      techLogos: body.techLogos || []
    });

    const savedProject = await project.save();

    return NextResponse.json({
      success: true,
      data: savedProject,
      message: "Project created successfully"
    });

  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}

// PUT - Update project
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    const updatedProject = await Project.findByIdAndUpdate(
      body.id,
      {
        title: body.title,
        description: body.description,
        image: body.image,
        tech: body.techStack,
        tags: body.tags,
        status: body.status,
        progress: body.progress,
        liveLink: body.liveLink,
        sourceCode: body.sourceCode,
        projectLogo: body.projectLogo,
        techLogos: body.techLogos
      },
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: "Project updated successfully"
    });

  } catch (error) {
    console.error("Project update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE - Delete project
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully"
    });

  } catch (error) {
    console.error("Project deletion error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
