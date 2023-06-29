import * as React from 'react'

import logger from '@/lib/logger'
import { FileStatus, StorageFiles } from '../../types'
import { UseStorageManager, UseStorageManagerProps } from './types'

export function useStorageManager(
  props: UseStorageManagerProps
): UseStorageManager {
  const { defaultFiles = [] } = props

  const [files, setFiles] = React.useState<StorageFiles>(() => {
    return defaultFiles.map(file => ({
      ...file,
      id: file.key,
      status: FileStatus.UPLOADED
    })) as StorageFiles
  })

  const addFile = ({ file }: { file: File }) => {
    const newUploads = [
      { id: file.name, file, key: file.name, status: FileStatus.QUEUED }
    ] as StorageFiles
    setFiles(prevFiles => [...prevFiles, ...newUploads])
  }

  const removeFile = ({ id }: { id: string }) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== id))
  }

  const setUploadingFile = ({ id }: { id: string }) => {
    setFiles(prevFiles =>
      prevFiles.map(file =>
        file.id === id ? { ...file, status: FileStatus.UPLOADING } : file
      )
    )
  }

  const setUploadSuccess = ({ id }: { id: string }) => {
    setFiles(prevFiles =>
      prevFiles.map(file =>
        file.id === id ? { ...file, status: FileStatus.UPLOADED } : file
      )
    )
  }

  const notImplementedFunction = () => {
    logger.warn('not implemented.')
  }

  return {
    addFile,
    clearFiles: notImplementedFunction,
    setUploadingFile,
    setUploadProgress: notImplementedFunction,
    setUploadSuccess,
    setUploadResumed: notImplementedFunction,
    setUploadPaused: notImplementedFunction,
    removeFile,
    files
  }
}
