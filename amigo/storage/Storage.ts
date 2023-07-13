import { Sha256 } from '@aws-crypto/sha256-browser'
import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  ListObjectsV2Command,
  ListObjectsV2Request,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client
} from '@aws-sdk/client-s3'
import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner'
import { createRequest } from '@aws-sdk/util-create-request'
import { formatUrl } from '@aws-sdk/util-format-url'
import { getSession } from 'next-auth/react'
import { Amigo } from '../core'

import { ICredentials, parseAWSExports } from '@/amigo/core'
import logger from '@/lib/logger'
import { StorageErrorStrings } from './StorageErrorStrings'
import {
  GetConfig,
  GetOutput,
  ListConfig,
  ListOutput,
  PutConfig,
  PutResult,
  RemoveConfig,
  RemoveOutput,
  StorageAccessLevel,
  StorageOptions
} from './types'

export class StorageClass {
  /**
   * @private
   */
  private _config: StorageOptions

  constructor(config?: StorageOptions) {
    this._config = config || {}
  }

  configure(config?: any): StorageOptions {
    logger.debug('configure Storage')
    if (!config) return this._config
    const awsConfig = parseAWSExports(config)
    this._config = Object.assign({}, this._config, awsConfig.Storage)
    if (!this._config.bucket) {
      logger.debug('Do not have bucket yet')
    }
    return this._config
  }

  public getModuleName() {
    return 'Storage'
  }

  private async _ensureCredentials(): Promise<boolean> {
    try {
      const { credentials } = (await getSession()) ?? {}
      if (!credentials) return false
      logger.debug('set credentials for storage', credentials)
      this._config.credentials = credentials
      return true
    } catch (error) {
      logger.warn('ensure credentials error', error)
      return false
    }
  }

  private async _prefix(config: {
    credentials?: ICredentials
    level?: StorageAccessLevel
  }) {
    const { credentials, level } = config
    if (level == 'private') {
      if (!credentials) throw new Error(StorageErrorStrings.NO_CREDENTIALS)
      return `private/${credentials.identityId}/`
    } else if (level == 'protected') {
      if (!credentials) throw new Error(StorageErrorStrings.NO_CREDENTIALS)
      return `protected/${credentials.identityId}/`
    } else {
      return 'public/'
    }
  }

  private _createNewS3Client(): S3Client {
    const { region, credentials } = this._config
    const s3client = new S3Client({ region, credentials })
    return s3client
  }

  public put = async (
    key: string,
    object: PutObjectCommandInput['Body'],
    config?: PutConfig
  ): Promise<PutResult> => {
    const credentialsOK = await this._ensureCredentials()
    if (!credentialsOK) throw new Error(StorageErrorStrings.NO_CREDENTIALS)

    const opt = Object.assign({}, this._config, config)
    const { bucket } = opt

    const prefix = await this._prefix(opt)
    const finalKey = key.startsWith(prefix) ? key : prefix + key
    const type = config?.contentType ?? 'binary/octet-stream'
    const s3 = this._createNewS3Client()

    logger.debug('finalKey %s', finalKey)
    const params: PutObjectCommandInput = {
      Bucket: bucket,
      Key: finalKey,
      Body: object,
      ContentType: type
    }

    try {
      const response = await s3.send(new PutObjectCommand(params))
      logger.debug('upload result', response)
      logger.debug(`Upload success for ${finalKey}`)
      return {
        key: finalKey
      }
    } catch (error) {
      logger.error('error uploading', error)
      throw error
    }
  }

  public list = async (
    path: string,
    config?: ListConfig
  ): Promise<ListOutput> => {
    const credentialsOK = await this._ensureCredentials()
    if (!credentialsOK) throw new Error(StorageErrorStrings.NO_CREDENTIALS)

    const opt = Object.assign({}, this._config, config)
    const { bucket, nextToken, pageSize } = opt

    const prefix = await this._prefix(opt)
    const finalPath = path.startsWith(prefix) ? path : prefix + path
    const s3 = this._createNewS3Client()

    logger.debug('list ' + path + ' from ' + finalPath)

    const MAX_PAGE_SIZE = 1000
    const params: ListObjectsV2Request = {
      Bucket: bucket,
      Prefix: finalPath,
      MaxKeys: MAX_PAGE_SIZE,
      ContinuationToken: nextToken
    }

    if (pageSize && typeof pageSize === 'number' && pageSize <= MAX_PAGE_SIZE) {
      params.MaxKeys = pageSize
    }

    const output: ListOutput = {
      results: [],
      hasNextToken: false
    }

    try {
      const response = await s3.send(new ListObjectsV2Command(params))
      if (response && response.Contents) {
        output.results = response.Contents.map(item => {
          return {
            key: item.Key?.substring(prefix.length),
            eTag: item.ETag,
            lastModified: item.LastModified,
            size: item.Size
          }
        })
        output.nextToken = response.NextContinuationToken
        output.hasNextToken = response.IsTruncated ?? false
      }
      return output
    } catch (error) {
      logger.error('Failed to list items', error)
      throw error
    }
  }

  public async get<T extends GetConfig>(
    key: string,
    config?: T
  ): Promise<GetOutput<T>> {
    logger.debug('Storage.get', key)
    const credentialsOK = await this._ensureCredentials()
    if (!credentialsOK) throw new Error(StorageErrorStrings.NO_CREDENTIALS)

    const opt = Object.assign({}, this._config, config)
    const { credentials, region, bucket, download } = opt

    const prefix = await this._prefix(opt)
    const finalKey = key.startsWith(prefix) ? key : prefix + key
    const s3 = this._createNewS3Client()

    const params: GetObjectCommandInput = {
      Bucket: bucket,
      Key: finalKey
    }

    if (download === true) {
      try {
        const response = await s3.send(new GetObjectCommand(params))
        logger.debug('Download success for', finalKey)
        return response as GetOutput<T>
      } catch (error) {
        logger.error('Download failed with', error)
        throw error
      }
    }

    try {
      if (!region) throw new Error(StorageErrorStrings.NO_REGION)
      if (!credentials) throw new Error(StorageErrorStrings.NO_CREDENTIALS)
      const signer = new S3RequestPresigner({
        region,
        credentials,
        sha256: Sha256
      })

      const request = await createRequest(s3, new GetObjectCommand(params))
      const url = formatUrl(
        await signer.presign(request, {
          expiresIn: 900
        })
      )
      logger.debug('getSignedUrl success. Signed URL:', url)
      return url as GetOutput<T>
    } catch (error) {
      logger.error('Could not get a signed URL for', finalKey)
      throw error
    }
  }

  public remove = async (
    key: string,
    config?: RemoveConfig
  ): Promise<RemoveOutput> => {
    const credentialsOK = await this._ensureCredentials()
    if (!credentialsOK) throw new Error(StorageErrorStrings.NO_CREDENTIALS)

    const opt = Object.assign({}, this._config, config)
    const { bucket } = opt

    const prefix = await this._prefix(opt)
    const finalKey = key.startsWith(prefix) ? key : prefix + key
    const s3 = this._createNewS3Client()
    logger.debug('remove ' + key + ' from ' + finalKey)

    const params: DeleteObjectCommandInput = {
      Bucket: bucket,
      Key: finalKey
    }

    try {
      const response = await s3.send(new DeleteObjectCommand(params))
      logger.debug(`Deleted ${key} successfully`)
      return response
    } catch (error) {
      logger.error(`Deletion of ${key} failed with ${error}`)
      throw error
    }
  }
}

export const Storage = new StorageClass()
Amigo.register(Storage)
