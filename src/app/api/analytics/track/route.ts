import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ApiAnalytics from '@/models/ApiAnalytics';

export async function POST(request: NextRequest) {
  try {
    // Check if this is an internal request
    const isInternal = request.headers.get('X-Internal-Request') === 'true';
    if (!isInternal) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const analyticsData = await request.json();
    
    // Create new analytics record
    const analytics = new ApiAnalytics(analyticsData);
    await analytics.save();
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
