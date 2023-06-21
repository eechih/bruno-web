import {
  DeleteObjectCommandOutput,
  GetObjectCommandOutput,
  _Object as ListObjectsCommandOutputContent
} from '@aws-sdk/client-s3'

import { Credentials } from '@/lib/credentials'

export type AccessLevel = 'private' | 'protected' | 'public'

export type StorageOptions = {
  credentials?: Credentials
  region?: string
  bucket?: string
  level?: AccessLevel
}

export type CommonStorageOptions = {
  region?: string
  bucket?: string
  level?: AccessLevel
}

export type PutConfig = CommonStorageOptions & {
  contentType?: string
}

export type PutResult = {
  key: string
}

export type ListConfig = CommonStorageOptions & {
  pageSize?: number | 'ALL'
  nextToken?: string
}

export interface ListOutputItem {
  key: ListObjectsCommandOutputContent['Key']
  eTag: ListObjectsCommandOutputContent['ETag']
  lastModified: ListObjectsCommandOutputContent['LastModified']
  size: ListObjectsCommandOutputContent['Size']
}

export type ListOutput = {
  results: ListOutputItem[]
  nextToken?: string
  hasNextToken: boolean
}

export type GetConfig = CommonStorageOptions & {
  download?: boolean
}

export type GetOutput<T> = T extends { download: true }
  ? GetObjectCommandOutput
  : string

export type RemoveConfig = CommonStorageOptions & {}

export type RemoveOutput = DeleteObjectCommandOutput
