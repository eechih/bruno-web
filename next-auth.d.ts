/* eslint-disable no-unused-vars */
import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    accessToken: string
    accessTokenExpires: number // Unix Timestamp (milliseconds)
    refreshToken: string
    idToken: string
    identityId: string
    credentials: {
      accessKeyId: string
      secretAccessKey: string
      sessionToken: string
      expiration?: Date
    }
    error?: 'RefreshAccessTokenError'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string
    accessTokenExpires: number // Unix Timestamp (milliseconds)
    idToken: string
    refreshToken: string
    identityId: string
    credentials: {
      accessKeyId: string
      secretAccessKey: string
      sessionToken: string
      expiration?: Date
    }
    error?: 'RefreshAccessTokenError'
  }
}
