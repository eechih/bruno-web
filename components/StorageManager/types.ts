/* eslint-disable no-unused-vars */

import { StorageAccessLevel, UploadTask } from '@/lib/aws/storage'
import { DialogProps } from './ui/Dialog'

export enum FileStatus {
  QUEUED = 'queued',
  UPLOADING = 'uploading',
  PAUSED = 'paused',
  ERROR = 'error',
  UPLOADED = 'uploaded'
}

export interface StorageFile {
  id: string
  file?: File
  status: FileStatus
  progress: number
  uploadTask?: UploadTask
  key: string
  error?: string
  isImage: boolean
}

export type StorageFiles = StorageFile[]

export type DefaultFile = Pick<StorageFile, 'key'>

export type ProcessFileParams = Required<Pick<StorageFile, 'file' | 'key'>> &
  Record<string, any>

export type ProcessFile = (
  params: ProcessFileParams
) => Promise<ProcessFileParams> | ProcessFileParams

export interface StorageManagerProps {
  acceptedFileTypes?: string[]
  accessLevel: StorageAccessLevel
  defaultFiles?: DefaultFile[]
  isResumable?: boolean
  maxFileCount: number
  maxFileSize?: number
  onFileRemove?: (file: { key: string }) => void
  onUploadError?: (error: string, file: { key: string }) => void
  onUploadSuccess?: (event: { key?: string }) => void
  onUploadStart?: (event: { key?: string }) => void
  processFile?: ProcessFile
  showThumbnails?: boolean
  dialogEnabled?: boolean // default: true
  dialogProps?: Omit<DialogProps, 'enabled' | 'children'>
}

export interface StorageManagerHandle {
  clearFiles: () => void
  openDialog: () => void
  closeDialog: () => void
}
