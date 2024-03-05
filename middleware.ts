import { authRoutes, wipRoutes } from "@/constants/routes";
import { isJwtTokenValid } from "@/utils/Authentication/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - login (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|logo.svg).*)",
  ],
};

export async function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value ?? "";
  const requestedPath = request.nextUrl.pathname;
  if (isJwtTokenValid(refreshToken)) {
    if (authRoutes.includes(requestedPath))
      // Redirect to home if user is already logged in
      return NextResponse.redirect(new URL("/", request.nextUrl.origin));
    else if (wipRoutes.includes(requestedPath))
      // Redirect to WIP page if user is already logged in
      return NextResponse.redirect(new URL("/wip", request.nextUrl.origin));
    // If user is already logged in, continue to the requested page
    else return null;
  }
  if (authRoutes.includes(requestedPath)) return null;
  return NextResponse.redirect(new URL("/login?nextUrl=" + encodeURIComponent(requestedPath), request.nextUrl.origin));
}
