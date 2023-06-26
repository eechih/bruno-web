/* eslint-disable no-unused-vars */
import { DocumentNode, GraphQLError } from 'graphql'

export type APIOptions = {}

export interface GraphQLAPIOptions {
  aws_appsync_graphqlEndpoint?: string
  aws_appsync_authenticationType?: string
  aws_appsync_apiKey?: string
}

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
