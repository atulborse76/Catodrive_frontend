// middleware.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ['/profile'];
  
  // Remove the redirect logic for now
  // if (protectedRoutes.some(route => pathname.startsWith(route))) {
  //   if (!token) {
  //     return NextResponse.redirect(new URL('/login', request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*'],
};