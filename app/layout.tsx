// /app/layout.tsx
// This file defines the global layout for the application.

import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navigation } from "@/components/layout/Navigation";

// Global layout that wraps the entire application.
// We apply NextAuthProvider to ensure session is available in client components.
export const metadata: Metadata = {
  title: "Gynergy Journal",
  description: "Your daily journal for growth and energy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navigation />
          <main className="main-content">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}