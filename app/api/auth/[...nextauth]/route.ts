import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import { NextAuthOptions } from "next-auth";
import { authOptions } from "./authOptions";
interface User {
  _id: string;
  email: string;
  password: string;
  role: string; // Add role to the User interface
}


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// import NextAuth from "next-auth";
// import { authOptions } from "@/app/api/auth/nextauth-options";  // Path to your auth options file

// export const GET = NextAuth(authOptions);
// export const POST = NextAuth(authOptions);
