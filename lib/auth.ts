import type { NextAuthOptions } from 'next-auth'
import CognitoProvider from 'next-auth/providers/cognito'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER
    }),
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com'
        },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('credentials', credentials)
        const user = { id: '1', name: 'Admin', email: 'admin@admin.com' }
        return user
      }
    })
  ],
  debug: true,

  callbacks: {
    jwt: async function ({ token, account }) {
      if (account) {
        token.access_token = account.access_token ?? ''
        token.expires_at = account.expires_at ?? Math.floor(Date.now() / 1000)
        token.refresh_token = account.refresh_token ?? ''
        return token
      } else if (Date.now() < token.expires_at * 1000) {
        // If the access token has not expired yet, return it
        return token
      } else {
        // If the access token has expired, try to refresh it
        try {
          return token
        } catch (error) {
          console.error('Error refreshing access token', error)
          // The error property will be used client-side to handle the refresh token error
          return { ...token, error: 'RefreshAccessTokenError' as const }
        }
      }
    },
    session: async function ({ session }) {
      return session
    }
  }
}
