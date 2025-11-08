// src/app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

// Define the AuthProvider component that wraps children with NextAuth's SessionProvider
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}