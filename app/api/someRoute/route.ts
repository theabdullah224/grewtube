import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Success' });
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ message: 'POST Success', body });
}
