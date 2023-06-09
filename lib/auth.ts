import type { NextAuthOptions } from 'next-auth'
import CognitoProvider from 'next-auth/providers/cognito'
import CredentialsProvider from 'next-auth/providers/credentials'

import { Auth } from '@/amigo'
import logger from '@/lib/logger'

const clientId = process.env.COGNITO_CLIENT_ID!
const clientSecret = process.env.COGNITO_CLIENT_SECRET!
const issuer = process.env.COGNITO_ISSUER!

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    CognitoProvider({
      clientId: clientId,
      clientSecret: clientSecret,
      issuer: issuer,
      authorization: {
        params: { scope: 'openid email profile aws.cognito.signin.user.admin' }
      }
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
        logger.debug('credentials', credentials)
        const user = { id: '1', name: 'Admin', email: 'admin@admin.com' }
        return user
      }
    })
  ],
  // debug: true,

  callbacks: {
    jwt: async function ({ token, account }) {
      if (account) {
        logger.debug('account', account)
        token.accessToken = account.access_token ?? ''
        // `token.accessTokenExpires` is a Unix timestamp in milliseconds.
        // `account.expires_at` is a Unix timestamp in seconds.
        token.accessTokenExpires = account.expires_at
          ? account.expires_at * 1000
          : 0
        token.refreshToken = account.refresh_token ?? ''
        token.idToken = account.id_token ?? ''
        token.credentials = await Auth.getCredentials(token.idToken)
        return token
      }

      logger.debug('token', token)
      // If the access token has not expired yet, return it
      if (Date.now() < token.accessTokenExpires) return token

      // If the access token has expired, try to refresh it
      try {
        const refreshedTokens = await Auth.refreshCognitoAccessToken(
          token.refreshToken
        )

        if (refreshedTokens) {
          logger.debug('refreshedTokens', refreshedTokens)
          const {
            AccessToken: accessToken,
            ExpiresIn: expiresIn, // The expiration period of the authentication result in seconds.
            IdToken: idToken,
            RefreshToken: refreshToken
          } = refreshedTokens

          if (accessToken) token.accessToken = accessToken
          if (idToken) token.idToken = idToken
          if (refreshToken) token.refreshToken = refreshToken
          if (expiresIn)
            token.accessTokenExpires = Date.now() + expiresIn * 1000
          if (idToken) token.credentials = await Auth.getCredentials(idToken)
        }

        return token
      } catch (error) {
        logger.error('Error refreshing access token', error)
        // The error property will be used client-side to handle the refresh token error
        return { ...token, error: 'RefreshAccessTokenError' as const }
      }
    },
    session: async function ({ session, token }) {
      session.accessToken = token.accessToken
      session.accessTokenExpires = token.accessTokenExpires
      session.refreshToken = token.refreshToken
      session.idToken = token.idToken
      session.credentials = token.credentials
      return session
    }
  }
}
