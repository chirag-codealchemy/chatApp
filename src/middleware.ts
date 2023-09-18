// import { NextRequestWithAuth, withAuth } from 'next-auth/middleware'
// import { NextResponse } from 'next/server'

// export default withAuth((req: NextRequestWithAuth) => {
//   if (req.nextUrl.pathname === '/login' && req.nextauth.token) {
//     return NextResponse.redirect(new URL('/', req.url))
//   }
// })

// export const config = { matchers: ['/'] }

import { NextResponse } from 'next/server'
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware'

// const corsHeaders = {
//   // 'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_BASE_URL || '',
//   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
//   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
// }

export default withAuth(
  (req: NextRequestWithAuth) => {
    const { nextUrl, nextauth } = req
    const { pathname } = nextUrl
    const { token } = nextauth

    // console.log('🚀 ~ file: middleware.ts:28 ~ token:', token, pathname)
    if (token) {
      if (pathname === '/login') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    } else {
      // FIXME
      // if (pathname.startsWith('/api')) {
      //   return NextResponse.json(
      //     { message: 'unauthenticated' },
      //     { status: 401 },
      //   )
      // }
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) =>
        !!token ||
        req.nextUrl.pathname.startsWith('/api') ||
        req.nextUrl.pathname.startsWith('/login'),
    },
    // pages: { signIn: '/login' },
  },
)

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
