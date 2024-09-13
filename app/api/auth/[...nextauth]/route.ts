// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import User from "@/models/userModel";
// import { connect } from "@/dbConfig/dbConfig";
// import { NextAuthOptions } from "next-auth";

// interface User {
//   _id: string;
//   email: string;
//   password: string;
//   role: string; // Add role to the User interface
// }

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         // Connect to the database
//         await connect();

//         // Check if credentials are provided
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Email and password are required.");
//         }

//         const { email, password } = credentials;

//         // Find user by email
//         const user = await User.findOne({ email }) as User | null;

//         // If user is not found, throw an error
//         if (!user) {
//           throw new Error("Invalid email or password.");
//         }

//         // Compare the password
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//           throw new Error("Invalid email or password.");
//         }

//         console.log("User role in authorize:", user.role); // Log the user's role for debugging

//         // Return user data including role
//         return { id: user._id.toString(), email: user.email, role: user.role };
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt", // Use JWT for session strategy
//     maxAge: 60 * 60, // 1 hour session expiry
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       // If user is available (on login), add the id and role to the token
//       if (user) {
//         console.log("User in JWT callback:", user); // Log the user object for debugging
//         token.id = user.id;
//         token.email = user.email;
//         token.role = user.role; // Add role to the JWT token
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       // Ensure role and other user details are added to the session
//       console.log("Token in session callback:", token); // Log the token object for debugging
//       if (token) {
//         session.user = {
//           id: token.id,
//           email: token.email,
//           role: token.role, // Include role in the session object
//         };
//       }
//       return session;
//     },
//   },
//   secret: process.env.JWT_SECRET, // Ensure you have the JWT secret set in your .env file
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };


import NextAuth from "next-auth";
import { authOptions } from "@/app/api/auth/nextauth-options"; // Correct import path

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; // Export handlers for GET and POST methods
