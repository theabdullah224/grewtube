// import NextAuth from 'next-auth';
// import GoogleProvider from 'next-auth/providers/google';
// import { connect } from '@/dbConfig/dbConfig';
// import User from '@/models/userModel';

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
  
//   session: {
//     strategy: 'jwt',
//     maxAge: 60 * 60, // 1 hour session
//   },

//   callbacks: {
//     async jwt({ token, user, account, profile }) {
//       if (account?.provider === 'google') {
//         await connect();  // Ensure MongoDB is connected

//         console.log('Google profile received:', profile);

//         let existingUser = await User.findOne({ email: token.email });

//         if (!existingUser) {
//           console.log('Creating new user for Google OAuth');

//           const newUser = await User.create({
//             username: profile?.name || 'Google User',
//             email: profile?.email,
//             provider: 'google',
//             role: 'user',
//           });

//           console.log('New user created:', newUser);

//           token.id = newUser._id.toString();
//           token.role = newUser.role;
//         } else {
//           console.log('User already exists:', existingUser);

//           token.id = existingUser._id.toString();
//           token.role = existingUser.role;
//         }
//       }

//       return token;
//     },

//     async session({ session, token }) {
//       session.user.id = token.id;
//       session.user.role = token.role;
//       return session;
//     },

//     async redirect({ url, baseUrl }) {
//       return baseUrl + '/dashboard';  // Redirect to dashboard
//     },
//   },

//   secret: process.env.JWT_SECRET,
// };

// export const GET = NextAuth(authOptions);
// export const POST = NextAuth(authOptions);
