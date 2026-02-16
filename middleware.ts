
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    // Allow access to login page
    if (pathname === '/admin/login' || pathname.startsWith('/admin/login?')) {
      // If already logged in, redirect to dashboard? 
      // Optional enhancement. Let's keep it simple.
      return NextResponse.next()
    }

    // Check for session cookie
    const token = request.cookies.get('admin_session')?.value
    const secret = process.env.ADMIN_SECRET
    
    // If no token or invalid token (if secret is available to check against)
    // Note: If ADMIN_SECRET is not available in edge runtime this check might fail.
    // Assuming standard environment.
    if (!token || (secret && token !== secret)) {
      const loginUrl = new URL('/admin/login', request.url)
      // loginUrl.searchParams.set('from', pathname) // unexpected redirect loop potential
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}
 
export const config = {
  matcher: '/admin/:path*',
}
