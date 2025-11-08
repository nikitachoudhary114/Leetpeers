// src/components/providers.tsx

"use client";

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';

// Exported component name must match the import in layout.tsx (AuthProvider)
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    // ThemeProvider enables Dark/Light Mode
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}