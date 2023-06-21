/* eslint-disable no-unused-vars */
import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    accessToken: string
    accessTokenExpires: number // Unix Timestamp (milliseconds)
    refreshToken: string
    idToken: string
    credentials: {
      accessKeyId: string
      secretAccessKey: string
      sessionToken: string
      identityId: string
      authenticated: boolean
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
    credentials: {
      accessKeyId: string
      secretAccessKey: string
      sessionToken: string
      identityId: string
      authenticated: boolean
      expiration?: Date
    }
    error?: 'RefreshAccessTokenError'
  }
}
