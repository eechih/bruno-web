import { Credentials } from '@/lib/aws/core'
import logger from '@/lib/logger'
import { GraphQLAPIClass } from './GraphQLAPI'
import { APIOptions, GraphQLOptions, GraphQLResult } from './types'

export class APIClass {
  /**
   * @private
   */
  private _config: APIOptions
  private _graphqlApi: GraphQLAPIClass

  Credentials = Credentials

  constructor(config?: APIOptions) {
    this._config = config || {}
    logger.debug('API Options', this._config)
    this._graphqlApi = new GraphQLAPIClass(config || {})
  }

  public configure(config?: any): APIOptions {
    logger.debug('configure API')
    if (!config) return this._config
    this._config = Object.assign({}, this._config, config)
    this.Credentials.configure(config)
    this._graphqlApi.configure(config)
    return this._config
  }

  async graphql<T = any>(options: GraphQLOptions): Promise<GraphQLResult<T>> {
    return this._graphqlApi.graphql(options)
  }
}

export const API = new APIClass()
