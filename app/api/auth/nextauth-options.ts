import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          await connect();
          const { email, password } = credentials;
  
          const user = await User.findOne({ email });
          if (!user) {
            throw new Error("Invalid email or password.");
          }
  
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            throw new Error("Invalid email or password.");
          }
  
          return { id: user._id.toString(), email: user.email, role: user.role };
        },
      }),
    ],
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
        }
        return token;
      },
      async session({ session, token }) {
        session.user = {
          id: token.id,
          email: token.email,
          role: token.role,
        };
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,  // Ensure secret is being used here
  };
  