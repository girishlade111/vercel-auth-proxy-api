import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes("favicon.ico") ||
    pathname.includes("robots.txt")
  ) {
    return NextResponse.next()
  }

  // Protected routes that require authentication
  const protectedPaths = ["/dashboard", "/profile", "/playlists", "/routes", "/create-playlist", "/test-runs"]

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  if (isProtectedPath) {
    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      })

      // If not authenticated, redirect to sign-in page
      if (!token) {
        const signInUrl = new URL("/auth/signin", request.url)
        signInUrl.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(signInUrl)
      }
    } catch (error) {
      console.error("Middleware error:", error)
      // Continue to the page, but the client will handle the error
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run on all paths
export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}
