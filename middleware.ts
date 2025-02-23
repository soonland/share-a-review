import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;

    // Only check admin routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/users")) {
      const token = req.nextauth.token;

      // Check if user is not admin
      if (!token?.is_admin) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
        }

        // Redirect non-admin users to home page
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Ensure user is authenticated
    },
  },
);

// Configure protected routes
export const config = {
  matcher: ["/admin/:path*", "/api/users/:path*"],
};
