import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ public routes (no auth required)
  const publicRoutes = ["/api/auth/login", "/api/auth/register"];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // ✅ only protect /api/room/* and /api/user/*
  if (pathname.startsWith("/api/room") || pathname.startsWith("/api/user")) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    try {
      const { payload } = await jwtVerify(token, SECRET);
      const userId = payload.id as string | undefined;

      if (!userId) {
        return NextResponse.json(
          { error: "Invalid token payload" },
          { status: 401 }
        );
      }

      // ✅ create a response
      const res = NextResponse.next();

      // ✅ set cookie for backend use (optional)
      res.cookies.set("userId", userId, {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // ✅ ALSO return userId in headers (for APIs to consume)
      res.headers.set("x-user-id", userId);

      return res;
    } catch (e) {
      console.error("JWT error:", e);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"], // middleware runs on ALL api routes
};
