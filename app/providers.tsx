// /app/providers.tsx
// This file provides a wrapper for the entire application.

"use client";

import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}