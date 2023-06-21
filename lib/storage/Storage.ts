import {
  ListObjectsV2Command,
  ListObjectsV2Request,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client
} from '@aws-sdk/client-s3'
import * as log from 'loglevel'
import { getSession } from 'next-auth/react'

import {
  CommonStorageOptions,
  ListConfig,
  ListOutput,
  PutConfig,
  PutResult
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

  log.info('finalKey %s', finalKey)
  const params: PutObjectCommandInput = {
    Bucket: bucket,
    Key: finalKey,
    Body: object,
    ContentType: type
  }

  try {
    const s3 = new S3Client({
      region,
      credentials: session.credentials
    })
    const response = await s3.send(new PutObjectCommand(params))
    log.info(response)
    return {
      key: finalKey
    }
  } catch (err) {
    log.error(err)
    throw err
  }
}

export const list = async (
  path: string,
  config?: ListConfig
): Promise<ListOutput> => {
  const session = await getSession()
  if (!session?.credentials) throw new Error('No credentials')
  log.info('session', session)

  const opt = Object.assign({}, config)
  const { nextToken, bucket = defaultBucket, pageSize } = opt
  const prefix = await _prefix(opt)
  const finalPath = prefix + path
  log.debug('list ' + path + ' from ' + finalPath)

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
    const s3 = new S3Client({
      region,
      credentials: session.credentials
    })
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
    log.error('Failed to list items', err)
    throw err
  }
}
