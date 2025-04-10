import { NextResponse } from 'next/server';

// List of public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/register',
  '/',
  '/favicon.ico',
  '/_next'
];

export function middleware(request) {
  // Check if the requested path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // Get the token from the cookies
  const token = request.cookies.get('accessToken');

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If there's no token and it's not a public route, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If there is a token, allow access to protected routes
  return NextResponse.next();
}

// Configure the paths that middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};