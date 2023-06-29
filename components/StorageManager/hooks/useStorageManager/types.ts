/* eslint-disable no-unused-vars */

import { DefaultFile, StorageFiles } from '../../types'

export interface UseStorageManagerProps {
  defaultFiles?: DefaultFile[]
}

export interface UseStorageManager {
  files: StorageFiles
  addFile: (params: { file: File }) => void
  removeFile: (params: { id: string }) => void
  setUploadingFile: (params: { id: string }) => void
  setUploadSuccess: (params: { id: string }) => void
}
