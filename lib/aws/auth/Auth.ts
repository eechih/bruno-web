import {
  AuthFlowType,
  AuthenticationResultType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand
} from '@aws-sdk/client-cognito-identity-provider'

import { Credentials, ICredentials, parseAWSExports } from '@/lib/aws/core'
import logger from '@/lib/logger'
import { AuthOptions } from './types'

export class AuthClass {
  /**
   * @private
   */
  private _config: AuthOptions
  Credentials = Credentials

  constructor(config?: AuthOptions) {
    this._config = config || {}
    logger.debug('Auth Options', this._config)
  }

  configure(config?: any): AuthOptions {
    logger.debug('configure Auth')
    if (!config) return this._config
    const awsConfig = parseAWSExports(config)
    this._config = Object.assign({}, this._config, awsConfig.Auth)
    this.Credentials.configure(config)
    return this._config
  }

  async refreshCognitoAccessToken(
    refreshToken: string
  ): Promise<AuthenticationResultType> {
    logger.debug('refreshing cognito access token...')
    const {
      region,
      userPoolWebClientId: clientId,
      userPoolWebClientSecret: clientSecret
    } = this._config
    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      ClientId: clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
        ...(clientSecret ? { SECRET_HASH: clientSecret } : {})
      }
    })

    const client = new CognitoIdentityProviderClient({ region })
    const response = await client.send(command)
    if (!response.AuthenticationResult)
      throw new Error('Failed to refresh cognito access token.')
    return response.AuthenticationResult
  }

  async getCredentials(idToken: string): Promise<ICredentials> {
    logger.debug('getting current credentials', idToken)
    return this.Credentials.get(idToken)
  }
}

export const Auth = new AuthClass()
