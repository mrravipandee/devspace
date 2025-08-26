import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Contact from '@/models/Contact';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const { name, email, message } = await req.json();
    
    // Get user IP address
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'Unknown';
    
    // Get user agent
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    
    // Get location (you can integrate with a geolocation service here)
    const location = 'Unknown'; // You can integrate with IP geolocation API
    
    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Create contact entry
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      userIp: ip,
      userAgent,
      location,
      createdAt: new Date()
    });
    
    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        createdAt: contact.createdAt
      }
    });
    
  } catch (error) {
    console.error('Error saving contact message:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    
    // Get all contact messages (for dashboard)
    const contacts = await Contact.find({})
      .sort({ createdAt: -1 })
      .select('-__v')
      .limit(100);
    
    return NextResponse.json({
      success: true,
      contacts
    });
    
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}
