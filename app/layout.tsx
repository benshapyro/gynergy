// /app/layout.tsx
// This file defines the global layout for the application.

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}