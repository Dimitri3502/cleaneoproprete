import {createServerClient} from '@supabase/ssr'
import {type NextRequest, NextResponse} from 'next/server'

export async function updateSession(request: NextRequest) {
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
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Protected routes
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith('/deals') ||
    request.nextUrl.pathname.startsWith('/upload') ||
    request.nextUrl.pathname.startsWith('/protected')

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Auth routes (redirect if already logged in)
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth/login') ||
                     request.nextUrl.pathname.startsWith('/auth/sign-up') ||
                     request.nextUrl.pathname.startsWith('/auth/forgot-password')

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/deals'
    return NextResponse.redirect(url)
  }

  return response
}
