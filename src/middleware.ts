// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin", // where to redirect if not signed in
  },
});

export const config = {
  matcher: [
    "/dashboard",
    "/profile",
    "/rooms",
    "/rooms/:path*",
    "/api/user/:path*",
    "/api/room/:path*",
    "/api/rooms/:path*",
  ],
};
