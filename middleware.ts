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
  const refreshToken = isJwtTokenValid(
    request.cookies.get("refreshToken")?.value ?? ""
  );
  if (refreshToken) {
    return authRoutes.includes(request.nextUrl.pathname)
      ? NextResponse.redirect(new URL("/", request.nextUrl.origin))
      : wipRoutes.includes(request.nextUrl.pathname)
      ? NextResponse.redirect(new URL("/wip", request.nextUrl.origin))
      : NextResponse.next();
  }
  if (authRoutes.includes(request.nextUrl.pathname)) return null;
  return NextResponse.redirect(
    new URL(
      "/login?nextUrl=" + request.nextUrl.pathname,
      request.nextUrl.origin
    )
  );
}
