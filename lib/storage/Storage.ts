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

import logger from '@/lib/logger'

import {
  CommonStorageOptions,
  GetConfig,
  GetOutput,
  ListConfig,
  ListOutput,
  PutConfig,
  PutResult,
  RemoveConfig,
  RemoveOutput
} from './types'

const region = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_REGION!
const defaultBucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET!

const _prefix = async (config: CommonStorageOptions) => {
  const { level } = config
  if (level == 'private') {
    const session = await getSession()
    return 'private/' + session?.identityId + '/'
  } else if (level == 'protected') {
    const session = await getSession()
    return 'protected/' + session?.identityId + '/'
  } else {
    return 'public/'
  }
}

export const put = async (
  key: string,
  object: PutObjectCommandInput['Body'],
  config?: PutConfig
): Promise<PutResult> => {
  const session = await getSession()
  if (!session?.credentials) throw new Error('No credentials')

  const opt = Object.assign({}, config)
  const { bucket = defaultBucket } = opt

  const prefix = await _prefix(opt)
  const finalKey = prefix + key
  const type = config?.contentType ?? 'binary/octet-stream'
  const s3 = new S3Client({
    region,
    credentials: session.credentials
  })

  logger.info('finalKey %s', finalKey)
  const params: PutObjectCommandInput = {
    Bucket: bucket,
    Key: finalKey,
    Body: object,
    ContentType: type
  }

  try {
    const response = await s3.send(new PutObjectCommand(params))
    logger.debug('upload result', response)
    logger.debug(`Upload success for ${key}`)
    return {
      key: finalKey
    }
  } catch (error) {
    logger.error('error uploading', error)
    throw error
  }
}

export const list = async (
  path: string,
  config?: ListConfig
): Promise<ListOutput> => {
  const session = await getSession()
  if (!session?.credentials) throw new Error('No credentials')
  logger.debug('session', session)

  const opt = Object.assign({}, config)
  const { nextToken, bucket = defaultBucket, pageSize } = opt
  const prefix = await _prefix(opt)
  const finalPath = prefix + path
  const s3 = new S3Client({
    region,
    credentials: session.credentials
  })

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
  } catch (err) {
    logger.error('Failed to list items', err)
    throw err
  }
}

export const get = async (
  key: string,
  config?: GetConfig
): Promise<GetOutput> => {
  const session = await getSession()
  if (!session?.credentials) throw new Error('No credentials')
  logger.debug('session', session)

  const opt = Object.assign({}, config)
  const { download, bucket = defaultBucket } = opt
  const prefix = await _prefix(opt)
  const finalKey = prefix + key
  const s3 = new S3Client({
    region,
    credentials: session.credentials
  })

  const params: GetObjectCommandInput = {
    Bucket: bucket,
    Key: finalKey
  }

  if (download === true) {
    try {
      const response = await s3.send(new GetObjectCommand(params))
      logger.info('Download success for', finalKey)
      return response
    } catch (error) {
      logger.error('Download failed with', error)
      throw error
    }
  }

  try {
    const signer = new S3RequestPresigner({
      region,
      credentials: session.credentials,
      sha256: Sha256
    })

    const request = await createRequest(s3, new GetObjectCommand(params))
    const url = formatUrl(
      await signer.presign(request, {
        expiresIn: 900
      })
    )
    logger.info('getSignedUrl success. Signed URL:', url)
    return url
  } catch (error) {
    logger.error('Could not get a signed URL for', finalKey)
    throw error
  }
}

export const remove = async (
  key: string,
  config?: RemoveConfig
): Promise<RemoveOutput> => {
  const session = await getSession()
  if (!session?.credentials) throw new Error('No credentials')
  logger.debug('session', session)

  const opt = Object.assign({}, config)
  const { bucket = defaultBucket } = opt
  const prefix = await _prefix(opt)
  const finalKey = prefix + key
  const s3 = new S3Client({
    region,
    credentials: session.credentials
  })
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
