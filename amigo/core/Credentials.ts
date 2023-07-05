import {
  CognitoIdentityClient,
  GetCredentialsForIdentityCommand,
  GetCredentialsForIdentityInput,
  GetIdCommand,
  GetIdCommandInput
} from '@aws-sdk/client-cognito-identity'

import logger from '@/lib/logger'
import { Amigo } from '.'
import { parseAWSExports } from './parseAWSExports'
import { CredentialsOptions, ICredentials } from './types'

export class CredentialsClass {
  /**
   * @private
   */
  private _config: CredentialsOptions

  constructor(config?: CredentialsOptions) {
    this._config = config || {}
  }

  public getModuleName() {
    return 'Credentials'
  }

  configure(config?: any): CredentialsOptions {
    if (!config) return this._config
    const awsConfig = parseAWSExports(config)
    this._config = Object.assign({}, this._config, awsConfig.Auth)
    return this._config
  }

  async getIdentityId(idToken: string): Promise<string> {
    logger.info('getIdentityId', idToken)
    const { region, identityPoolId, userPoolId } = this._config
    const cognitoIdp = `cognito-idp.${region}.amazonaws.com/${userPoolId}`
    const input: GetIdCommandInput = {
      IdentityPoolId: identityPoolId,
      Logins: {
        [cognitoIdp]: idToken
      }
    }

    const identityClient = new CognitoIdentityClient({ region })

    const command = new GetIdCommand(input)
    const response = await identityClient.send(command)
    if (!response.IdentityId) throw new Error('Failed to get identityId.')
    return response.IdentityId
  }

  async get(idToken: string): Promise<ICredentials> {
    logger.info('get by idToken', idToken)
    const identityId = await this.getIdentityId(idToken)

    const { region, userPoolId } = this._config
    const cognitoIdp = `cognito-idp.${region}.amazonaws.com/${userPoolId}`

    const identityClient = new CognitoIdentityClient({ region })

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

    if (!Credentials || !IdentityId)
      throw new Error('Failed to get credentials.')

    return {
      accessKeyId: Credentials.AccessKeyId ?? '',
      expiration: Credentials.Expiration,
      sessionToken: Credentials.SessionToken ?? '',
      secretAccessKey: Credentials.SecretKey ?? '',
      authenticated: true,
      identityId: IdentityId
    }
  }
}

export const Credentials = new CredentialsClass()
Amigo.register(Credentials)
