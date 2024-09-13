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
//         await connect();

//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Email and password are required.");
//         }

//         const { email, password } = credentials;

//         const user = await User.findOne({ email }) as User | null;
//         if (!user) {
//           throw new Error("Invalid email or password.");
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//           throw new Error("Invalid email or password.");
//         }

//         return { id: user._id.toString(), email: user.email };
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//     maxAge: 60 * 60, 
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user = { id: token.id, email: token.email };
//       }
//       return session;
//     },
//   },
//   secret: process.env.JWT_SECRET, 
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };


import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig"; 
import { NextAuthOptions } from "next-auth";

interface User {
  _id: string;
  email: string;
  password: string;
}

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

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        const { email, password } = credentials;

        const user = await User.findOne({ email }) as User | null;
        if (!user) {
          throw new Error("Invalid email or password.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid email or password.");
        }

        return { id: user._id.toString(), email: user.email };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, 
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = { id: token.id, email: token.email };
      }
      return session;
    },
  },
  secret: process.env.JWT_SECRET, 
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };