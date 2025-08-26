import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hostname: req.nextUrl.hostname,
  });
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 200 });
}
