import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This middleware protects routes that require authentication
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Create Supabase client for middleware
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Get session from cookies
  const refreshToken = req.cookies.get('sb-refresh-token')?.value;
  const accessToken = req.cookies.get('sb-access-token')?.value;
  
  let session = null;
  
  if (refreshToken && accessToken) {
    try {
      const { data, error } = await supabase.auth.setSession({
        refresh_token: refreshToken,
        access_token: accessToken,
      });
      
      if (!error && data.session) {
        session = data.session;
      }
    } catch (error) {
      console.log('Session validation failed in middleware');
    }
  }

  // Define protected routes that require authentication
  const protectedRoutes = [
    '/polls',
  ];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // If accessing a protected route without a session, redirect to sign-in
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/sign-in', req.url);
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If accessing auth pages with a session, redirect to profile
  if ((req.nextUrl.pathname === '/auth/sign-in' || req.nextUrl.pathname === '/auth/sign-up') && session) {
    return NextResponse.redirect(new URL('/polls', req.url));
  }

  return res;
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/polls/:path*',
    '/auth/:path*',
  ],
};