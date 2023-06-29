/* eslint-disable no-unused-vars */

import { DefaultFile, StorageFiles } from '../../types'

export interface UseStorageManagerProps {
  defaultFiles?: DefaultFile[]
}

export interface UseStorageManager {
  addFiles: (params: { files: File[] }) => void
  clearFiles: () => void
  setUploadingFile: (params: { id: string }) => void
  setUploadProgress: (params: { id: string; progress: number }) => void
  setUploadSuccess: (params: { id: string }) => void
  setUploadResumed: (params: { id: string }) => void
  setUploadPaused: (params: { id: string }) => void
  removeUpload: (params: { id: string }) => void
  files: StorageFiles
}
