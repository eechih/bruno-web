/* eslint-disable no-unused-vars */

import { DefaultFile, StorageFiles, StorageManagerProps } from '../types'

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

export type UseUploadFilesProps = Pick<
  StorageManagerProps,
  | 'accessLevel'
  | 'maxFileCount'
  | 'onUploadStart'
  | 'onUploadSuccess'
  | 'onUploadError'
> &
  Pick<UseStorageManager, 'files' | 'setUploadSuccess' | 'setUploadingFile'>
