export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/products/:path*',
    '/account',
    '/profile',
    '/blog',
    '/dashboard/:path*'
  ]
}
