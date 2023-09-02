import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // if user has no valid token and requests a page that is not /login, redirect back to login
  if (!token && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // allow requests to api/auth
  if (token || request.nextUrl.pathname.includes("/api/auth")) {
    return NextResponse.next();
  }

}

export const config = {
  // match all paths except for api routes, static files, images or favicon
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}