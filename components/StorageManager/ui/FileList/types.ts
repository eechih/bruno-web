/* eslint-disable no-unused-vars */

import { StorageFile } from '../../types'

export interface FileListProps {
  files: StorageFile[]
  isResumable: boolean
  onCancelUpload: (params: { id: string }) => void
  onDeleteUpload: (params: { id: string }) => void
  onPause: (params: { id: string }) => void
  onResume: (params: { id: string }) => void
  showThumbnails: boolean
  hasMaxFilesError: boolean
  maxFileCount: number
}
