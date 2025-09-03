// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/api/auth/signin", // where to redirect if not signed in
  },
});

export const config = {
  matcher: [
    "/profile",
    "/api/user/:path*",
    "/api/room/:path*", // protect these APIs and pages
  ],
};
