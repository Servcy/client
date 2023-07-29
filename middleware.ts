import { publicRoutes } from "@/router/routes";
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
    "/((?!login|_next/static|_next/image|favicon.ico).*)",
  ],
};

export function middleware(request: NextRequest) {
  const refreshToken = isJwtTokenValid(
    request.cookies.get("refreshToken")?.value ?? ""
  );
  const accessToken = isJwtTokenValid(
    request.cookies.get("accessToken")?.value ?? ""
  );
  if (
    (refreshToken && accessToken) ||
    publicRoutes.includes(request.nextUrl.pathname)
  ) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/login", request.url));
}
