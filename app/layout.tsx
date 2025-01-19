// /app/layout.tsx
// This file defines the global layout for the application.

import "./globals.css";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

// Global layout that wraps the entire application.
// We apply NextAuthProvider to ensure session is available in client components.
export const metadata = {
  title: "Gynergy Member Portal",
  description: "Empower members to sustain growth through journaling and accountability."
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          {/* You can add global nav / header here if desired */}
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}