import {
  DeleteObjectCommandOutput,
  GetObjectCommandOutput,
  _Object as ListObjectsCommandOutputContent
} from '@aws-sdk/client-s3'

import { ICredentials } from '@/amigo'

export type StorageAccessLevel = 'private' | 'protected' | 'public'

export type StorageOptions = {
  credentials?: ICredentials
  region?: string
  level?: StorageAccessLevel
  bucket?: string
}

export interface UploadTask {
  resume(): any
  pause(): any
  percent: number
  isInProgress: boolean
}

export type CommonStorageOptions = {
  region?: string
  bucket?: string
  level?: StorageAccessLevel
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
