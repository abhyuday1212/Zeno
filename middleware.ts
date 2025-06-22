// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        const publicRoutes = ["/auth/signin", "/auth/signup", "/"];
        const authRoutes = ["/auth/signin", "/auth/signup"];

        // Allow access to public routes for all users
        if (publicRoutes.includes(pathname)) {
          return true;
        }

        // Redirect logged-in users away from auth routes
        if (authRoutes.includes(pathname) && token) {
          return false;
        }

        // Require authentication for protected routes
        if (
          pathname.startsWith("/user/") ||
          // pathname.startsWith("/partner/") ||
          pathname.startsWith("/admin/")
        ) {
          return !!token;
        }

        // Allow access to other routes if authenticated
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) <- This is the key fix!
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Files with extensions (.png, .jpg, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
    "/user/:path*",
    "/partner/:path*",
    "/admin/:path*",
  ],
};
