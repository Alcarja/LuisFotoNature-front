import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // 1. Log every request to /admin to see if the cookie is even arriving
  if (pathname.startsWith("/admin")) {
    console.log("--- Middleware Security Check ---");
    console.log("Path:", pathname);
    console.log("Cookie 'token' present:", !!token);

    // 2. If token is missing, let's see what cookies ARE there
    if (!token) {
      const allCookies = request.cookies.getAll();
      console.log(
        "Visible Cookies:",
        allCookies.map((c) => c.name),
      );

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
