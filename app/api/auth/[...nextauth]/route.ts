// /app/api/auth/[...nextauth]/route.ts
// This is the NextAuth route. It references our authOptions.

import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };