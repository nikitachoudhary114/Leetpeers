// src/app/api/auth/logout/route.ts
// This route is NOT necessary if you just use signOut() on the client,
// but if needed, it should handle token removal if you were setting a custom token.
// The client-side signOut() from next-auth/react is the preferred method.

import { NextResponse } from "next/server";

export async function POST() {
    // Client-side next-auth/react's signOut() handles the JWT cookie cleanup automatically.
    // If you need a manual server route (usually not required):
    
    // Create a response object
    const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });

    // Expire the NextAuth cookie (optional, next-auth does this)
    response.cookies.set("next-auth.session-token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(0), // Set to expire immediately
    });

    return response;
}