/* eslint-disable no-unused-vars */
import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    access_token: string
    error?: 'RefreshAccessTokenError'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string
    expires_at: number
    refresh_token: string
    error?: 'RefreshAccessTokenError'
  }
}
