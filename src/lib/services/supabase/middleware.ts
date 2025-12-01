// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            try {
              request.cookies.set(name, value);
            } catch {
              /* ignore — NextRequest cookies are immutable in edge runtime */
            }
          });

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  // CRITICAL: Allow /reset-password to load without auth checks
  // The SupabaseHashHandler will process the tokens from the URL hash
  if (pathname === '/reset-password') {
    return supabaseResponse;
  }

  // Get both session and user to verify authentication
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  // Check if user is actually authenticated (must have BOTH valid session AND user)
  const isAuthenticated = !sessionError && !userError && !!session && !!user;

  const protectedRoutes = [
    '/findJobs', 
    '/profile', 
    '/settings', 
    '/manageJobPosts', 
    '/appliedJobs', 
    '/chat', 
    '/query'
  ];
  const authRoutes = ['/login', '/signup', '/forgot-password'];
  const publicRoutes = ['/', '/auth/callback'];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/auth/'));

  // Allow public routes
  if (isPublicRoute) {
    return supabaseResponse;
  }

  // CRITICAL: Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    console.log('🚫 Blocking access to protected route:', pathname, 'Auth status:', isAuthenticated);
    
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectedFrom', pathname);
    url.searchParams.set('error', 'Please log in to access this page');

    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/findJobs';

    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};