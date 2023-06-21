import {
  CognitoIdentityClient,
  GetCredentialsForIdentityCommand,
  GetCredentialsForIdentityInput,
  GetIdCommand,
  GetIdCommandInput
} from '@aws-sdk/client-cognito-identity'

import logger from '@/lib/logger'

const region = process.env.AWS_REGION!
const userPoolId = process.env.AWS_COGNITO_USER_POOL_ID!
const identityPoolId = process.env.AWS_COGNITO_IDENTITY_POOL_ID!
const cognitoIdp = `cognito-idp.${region}.amazonaws.com/${userPoolId}`

const identityClient = new CognitoIdentityClient({ region })

export interface Credentials {
  accessKeyId: string
  sessionToken: string
  secretAccessKey: string
  identityId: string
  authenticated: boolean
  // Long term creds do not provide an expiration date
  expiration?: Date
}

export const getIdentityId = async (idToken: string): Promise<string> => {
  logger.info('getIdentityId', idToken)
  const input: GetIdCommandInput = {
    IdentityPoolId: identityPoolId,
    Logins: {
      [cognitoIdp]: idToken
    }
  }

  const command = new GetIdCommand(input)
  const response = await identityClient.send(command)
  if (!response.IdentityId) throw new Error('Failed to get identityId.')
  return response.IdentityId
}

export const getCredentials = async (idToken: string): Promise<Credentials> => {
  logger.info('getCredentials...', idToken)
  const identityId = await getIdentityId(idToken)

  const input: GetCredentialsForIdentityInput = {
    IdentityId: identityId,
    Logins: {
      [cognitoIdp]: idToken
    }
  }
  const command = new GetCredentialsForIdentityCommand(input)
  const response = await identityClient.send(command)
  logger.debug('response', response)
  const { Credentials, IdentityId } = response

  if (!Credentials || !IdentityId) throw new Error('Failed to get credentials.')

  return {
    accessKeyId: Credentials.AccessKeyId ?? '',
    expiration: Credentials.Expiration,
    sessionToken: Credentials.SessionToken ?? '',
    secretAccessKey: Credentials.SecretKey ?? '',
    authenticated: true,
    identityId: IdentityId
  }
}
