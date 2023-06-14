/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { DocumentNode, GraphQLError } from 'graphql'

export enum GRAPHQL_AUTH_MODE {
  API_KEY = 'API_KEY',
  AWS_IAM = 'AWS_IAM',
  OPENID_CONNECT = 'OPENID_CONNECT',
  AMAZON_COGNITO_USER_POOLS = 'AMAZON_COGNITO_USER_POOLS',
  AWS_LAMBDA = 'AWS_LAMBDA'
}

export interface GraphQLOptions {
  query: string | DocumentNode
  variables?: object
  authMode?: keyof typeof GRAPHQL_AUTH_MODE
  authToken?: string
  userAgentSuffix?: string
}

export interface GraphQLResult<T = object> {
  data?: T
  errors?: GraphQLError[]
  extensions?: {
    [key: string]: any
  }
}

export enum GraphQLAuthError {
  NO_API_KEY = 'No api-key configured',
  NO_CURRENT_USER = 'No current user',
  NO_CREDENTIALS = 'No credentials',
  NO_FEDERATED_JWT = 'No federated jwt',
  NO_AUTH_TOKEN = 'No auth token specified'
}

export interface GraphQLAPIOptions {
  aws_appsync_graphqlEndpoint?: string
  aws_appsync_authenticationType?: string
  aws_appsync_apiKey?: string
}

export class GraphQLAPIClass {
  /**
   * @private
   */
  private _options: GraphQLAPIOptions

  constructor(options: GraphQLAPIOptions) {
    this._options = options
    console.debug('API Options', this._options)
  }

  configure(options: GraphQLAPIOptions) {
    this._options = Object.assign({}, this._options, options)
    return this._options
  }

  private async _headerBasedAuth(
    defaultAuthenticationType?: keyof typeof GRAPHQL_AUTH_MODE,
    additionalHeaders: { [key: string]: string } = {}
  ) {
    const { aws_appsync_authenticationType, aws_appsync_apiKey: apiKey } =
      this._options

    const authenticationType =
      defaultAuthenticationType || aws_appsync_authenticationType || 'AWS_IAM'

    let headers = {}

    switch (authenticationType) {
      case 'API_KEY':
        if (!apiKey) {
          throw new Error(GraphQLAuthError.NO_API_KEY)
        }
        headers = {
          Authorization: null,
          'X-Api-Key': apiKey
        }
        break
      case 'OPENID_CONNECT':
        throw new Error('OPENID_CONNECT is not supported')
      case 'AWS_IAM':
        throw new Error('AWS_IAM is not supported')
      case 'AMAZON_COGNITO_USER_POOLS':
        if (!additionalHeaders.Authorization) {
          throw new Error(GraphQLAuthError.NO_AUTH_TOKEN)
        }
        headers = {
          Authorization: additionalHeaders.Authorization
        }
        break
      case 'AWS_LAMBDA':
        throw new Error('AWS_LAMBDA is not supported')
      default:
        headers = {
          Authorization: null
        }
        break
    }

    return headers
  }

  async graphql<T = any>(options: GraphQLOptions): Promise<GraphQLResult<T>> {
    const { query, variables = {}, authMode, authToken } = options
    const { aws_appsync_graphqlEndpoint: appSyncGraphqlEndpoint } =
      this._options

    const additionalHeaders: Record<string, string> = {}

    // if an authorization header is set, have the explicit authToken take precedence
    if (authToken) {
      additionalHeaders.Authorization = authToken
    }

    const headers = {
      ...(await this._headerBasedAuth(authMode, additionalHeaders))
    }

    const init = Object.assign({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      })
    })

    const endpoint = appSyncGraphqlEndpoint

    if (!endpoint) {
      const error = new GraphQLError('No graphql endpoint provided.')
      throw {
        data: {},
        errors: [error]
      }
    }

    let result

    try {
      const response = await fetch(endpoint, init)
      result = await response.json()
    } catch (err) {
      const error = err as Error
      result = {
        data: {},
        errors: [new GraphQLError(error.message, { originalError: error })]
      }
    }

    const { errors } = result

    if (errors && errors.length) {
      throw errors[0]
    }

    console.log('result', result)
    return result
  }
}

export const GraphQLAPI = new GraphQLAPIClass({})
