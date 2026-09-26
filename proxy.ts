import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that require a signed-in user. Role-specific checks (e.g. admin-only
// for /partner/admin) happen server-side in each page/layout, not here —
// this is the "optimistic" check, not the source of truth.
const protectedPrefixes = ['/dashboard', '/providers', '/partner/apply', '/partner/admin', '/partner/dashboard']

export default async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

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
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // IMPORTANT: do not add logic between createServerClient and getUser().
  // A bug here can randomly log users out — see Supabase SSR docs.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isProtected = protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix))

  if (isProtected && !user) {
    const signInUrl = new URL('/signin', request.url)
    signInUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  if (request.nextUrl.pathname === '/signin' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
