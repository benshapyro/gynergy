// /app/layout.tsx
// This file defines the global layout for the application.

import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navigation } from "@/components/layout/Navigation";
import { Toaster } from 'react-hot-toast';

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
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgb(32, 32, 32)',
              color: 'rgb(220, 220, 220)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
            success: {
              iconTheme: {
                primary: 'rgb(255, 200, 120)',
                secondary: 'rgb(32, 32, 32)',
              },
            },
          }}
        />
      </body>
    </html>
  );
}