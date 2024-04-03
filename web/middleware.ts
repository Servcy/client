import { NextRequest, NextResponse } from "next/server"

import Cookies from "js-cookie"

import { isJwtTokenValid } from "@helpers/jwt.helper"

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
}

export async function middleware(request: NextRequest) {
    const accessToken = Cookies.get("accessToken") ?? ""
    const requestedPath = request.nextUrl.pathname
    if (isJwtTokenValid(accessToken)) {
        if (["/login", "/workspace/invite"].includes(requestedPath))
            // Redirect to home if user is already logged in
            return NextResponse.redirect(new URL("/", request.nextUrl.origin))
        // If user is already logged in, continue to the requested page
        else return null
    }
    Cookies.remove("accessToken")
    Cookies.remove("refreshToken")
    if (["/login", "/workspace/invite"].includes(requestedPath)) return null
    return NextResponse.redirect(new URL("/login?nextUrl=" + encodeURIComponent(requestedPath), request.nextUrl.origin))
}
