// /lib/authOptions.ts
// Configures NextAuth with a SupabaseAdapter or another approach. Below is a generic example using credential-based login plus a SupabaseAdapter. Adjust providers, database, or JWT strategy as needed.

import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import type { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: SupabaseAdapter({
    databaseUrl: process.env.SUPABASE_DATABASE_URL as string,
  }),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // Example naive credentials check:
      async authorize(credentials, req) {
        // In production, you'd verify credentials against
        // your existing user table or do a RPC call to Supabase.
        // If valid, return user object with id, name, email, etc.
        // If invalid, return null.

        if (!credentials?.email || !credentials?.password) return null;

        // Example: always accept if password is "test"
        if (credentials.password === "test") {
          return {
            id: "temp_user_id",
            email: credentials.email,
            name: "Test User",
          };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
  pages: {
    signIn: "/(auth)/login", // if you want NextAuth to redirect to your custom login
  },
};