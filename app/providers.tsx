// /app/providers.tsx
// This file provides a SessionProvider to wrap the entire application.
// It's used to ensure that session data is available in client components. 

"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}