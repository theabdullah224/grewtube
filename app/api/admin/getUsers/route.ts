import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig'; // Ensure this is your DB connection file
import User from '@/models/userModel'; // User model

// Ensure database is connected
connect();

export async function GET() {
  try {
    // Fetch all users from the database
    const users = await User.find({});
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
