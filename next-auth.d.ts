/* eslint-disable no-unused-vars */
import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    accessToken: string
    refreshToken: string
    identityId: string
    credentials: {
      accessKeyId: string
      expiration: string
      secretKey: string
      sessionToken: string
    }
    error?: 'RefreshAccessTokenError'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string
    accessTokenExpires: number
    idToken: string
    refreshToken: string
    identityId: string
    credentials: {
      accessKeyId: string
      expiration: string
      secretKey: string
      sessionToken: string
    }
    error?: 'RefreshAccessTokenError'
  }
}
