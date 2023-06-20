import {
  CognitoIdentityClient,
  Credentials,
  GetCredentialsForIdentityCommand,
  GetCredentialsForIdentityInput,
  GetIdCommand,
  GetIdCommandInput
} from '@aws-sdk/client-cognito-identity'
import {
  AuthFlowType,
  AuthenticationResultType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand
} from '@aws-sdk/client-cognito-identity-provider'
import type { NextAuthOptions } from 'next-auth'
import CognitoProvider from 'next-auth/providers/cognito'
import CredentialsProvider from 'next-auth/providers/credentials'

const REGION = 'us-east-1'
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID!
const COGNITO_CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET!
const COGNITO_ISSUER = process.env.COGNITO_ISSUER!
const COGNITO_IDENTITY_POOL_ID = process.env.COGNITO_IDENTITY_POOL_ID!
const COGNITO_IDP = process.env.COGNITO_IDP!

const identityClient = new CognitoIdentityClient({ region: REGION })
const identityProviderClient = new CognitoIdentityProviderClient({
  region: REGION
})

const getIdentityId = async (idToken: string): Promise<string> => {
  console.log('getIdentityId', idToken)
  const input: GetIdCommandInput = {
    IdentityPoolId: COGNITO_IDENTITY_POOL_ID,
    Logins: {
      [COGNITO_IDP]: idToken
    }
  }

  const command = new GetIdCommand(input)
  const response = await identityClient.send(command)
  console.log('response', response)
  if (!response.IdentityId) throw new Error('Failed to get identityId.')
  return response.IdentityId
}

const getCredentials = async (
  idToken: string,
  identityId: string
): Promise<Credentials> => {
  console.log('getCredentials...', idToken, identityId)
  const input: GetCredentialsForIdentityInput = {
    IdentityId: identityId,
    Logins: {
      [COGNITO_IDP]: idToken
    }
  }
  const command = new GetCredentialsForIdentityCommand(input)
  const response = await identityClient.send(command)
  console.log('response', response)
  if (!response.Credentials) throw new Error('Failed to get credentials.')
  return response.Credentials
}

const refreshCognitoAccessToken = async (
  refreshToken: string
): Promise<AuthenticationResultType> => {
  console.log('refreshCognitoAccessToken...')
  const command = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
    ClientId: COGNITO_CLIENT_ID,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken
    }
  })
  const response = await identityProviderClient.send(command)
  if (!response.AuthenticationResult)
    throw new Error('Failed to refresh cognito access token.')
  return response.AuthenticationResult
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    CognitoProvider({
      clientId: COGNITO_CLIENT_ID,
      clientSecret: COGNITO_CLIENT_SECRET,
      issuer: COGNITO_ISSUER,
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
        token.accessToken = account.access_token ?? ''
        token.accessTokenExpires = account.expires_at ?? 0
        token.refreshToken = account.refresh_token ?? ''
        token.idToken = account.id_token ?? ''

        if (token.idToken) {
          const identityId = await getIdentityId(token.idToken)
          token.identityId = identityId
          const credentials = await getCredentials(token.idToken, identityId)
          token.credentials = {
            accessKeyId: credentials.AccessKeyId ?? '',
            secretKey: credentials.SecretKey ?? '',
            sessionToken: credentials.SessionToken ?? '',
            expiration: credentials.Expiration?.toISOString() ?? ''
          }
        }
        return token
      }

      // If the access token has not expired yet, return it
      if (Date.now() < token.accessTokenExpires * 1000) return token

      // If the access token has expired, try to refresh it
      try {
        const refreshedTokens = await refreshCognitoAccessToken(
          token.refreshToken
        )
        if (refreshedTokens) {
          token.accessToken = refreshedTokens.AccessToken ?? token.accessToken
          token.accessTokenExpires = refreshedTokens?.ExpiresIn
            ? Date.now() + refreshedTokens?.ExpiresIn * 1000
            : token.accessTokenExpires
          token.idToken = refreshedTokens.IdToken ?? token.idToken
          token.refreshToken =
            refreshedTokens?.RefreshToken ?? token.refreshToken
        }
        return token
      } catch (error) {
        console.error('Error refreshing access token', error)
        // The error property will be used client-side to handle the refresh token error
        return { ...token, error: 'RefreshAccessTokenError' as const }
      }
    },
    session: async function ({ session, token }) {
      session.accessToken = token.accessToken
      session.identityId = token.identityId
      session.credentials = token.credentials
      session.refreshToken = token.refreshToken
      return session
    }
  }
}
