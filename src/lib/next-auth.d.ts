// src/types/next-auth.d.ts

import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend the NextAuth types to include the custom 'id' field for the JWT token
declare module "next-auth/jwt" {
  interface JWT {
    id: string; // The custom user ID added in the jwt callback
  }
}

// Extend the NextAuth types to include the custom 'id' field for the session user object
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // The custom user ID now available on the session object
    } & DefaultSession["user"];
  }
}
