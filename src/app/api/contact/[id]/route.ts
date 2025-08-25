import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Contact from '@/models/Contact';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { id } = params;
    const { status } = await req.json();
    
    if (!status || !['read', 'replied'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "read" or "replied"' },
        { status: 400 }
      );
    }
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact message not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Status updated successfully',
      contact
    });
    
  } catch (error) {
    console.error('Error updating contact status:', error);
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }
}
