import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

// Ensure MongoDB is connected
connect();

async function handleRequest(request: NextRequest, method: string) {
  try {
    // Get the user's token
    const token = await getToken({ req: request, secret: process.env.JWT_SECRET });

    if (!token || !token.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = token.email;

    // Find the user by email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (method === "POST") {
      const { videoUrl } = await request.json();

      // Add the new URL to the user's links array
      user.links.push({ url: videoUrl, createdAt: new Date() });

      // Save the updated user document
      const updatedUser = await user.save();

      // Respond with the updated links array
      return NextResponse.json({ message: "URL saved successfully", links: updatedUser.links });

    } else if (method === "GET") {
      // Return the user's saved URLs (links)
      return NextResponse.json({ urls: user.links }, { status: 200 });
    } else {
      // Handle unsupported HTTP methods
      return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
  } catch (error: any) {
    console.error("Error handling request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return handleRequest(request, "GET");
}

export async function POST(request: NextRequest) {
  return handleRequest(request, "POST");
}