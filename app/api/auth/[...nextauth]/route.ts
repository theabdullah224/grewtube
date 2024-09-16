import NextAuth from "next-auth";
import { authOptions } from "./authOptions";

// Export the NextAuth handler as GET and POST
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };