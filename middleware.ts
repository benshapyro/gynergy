import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // In development mode, allow all access
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // If user is not signed in and the current path is not / redirect the user to /
  if (!session && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user is signed in and the current path is / redirect to /dashboard or /onboarding
  if (session && request.nextUrl.pathname === '/') {
    const isOnboarded = session.user.user_metadata.onboarded
    return NextResponse.redirect(new URL(isOnboarded ? '/dashboard' : '/onboarding', request.url))
  }

  // If user is signed in but not onboarded and tries to access /dashboard, redirect to /onboarding
  if (session && !session.user.user_metadata.onboarded && request.nextUrl.pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  // If user is signed in and onboarded and tries to access /onboarding, redirect to /dashboard
  if (session && session.user.user_metadata.onboarded && request.nextUrl.pathname === '/onboarding') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/', '/dashboard', '/onboarding']
} 