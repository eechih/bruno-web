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

  const addFiles = ({ files }: { files: File[] }) => {
    const newUploads = files.map(file => {
      return {
        id: file.name,
        file,
        key: file.name,
        status: FileStatus.QUEUED,
        isImage: file.type.startsWith('image/')
      }
    }) as StorageFiles

    setFiles(prevFiles => {
      const newFiles = [...prevFiles, ...newUploads]
      return newFiles
    })
  }

  const clearFiles = () => {
    setFiles([])
  }

  const removeUpload = ({ id }: { id: string }) => {
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
    addFiles,
    clearFiles,
    setUploadingFile,
    setUploadProgress: notImplementedFunction,
    setUploadSuccess,
    setUploadResumed: notImplementedFunction,
    setUploadPaused: notImplementedFunction,
    removeUpload,
    files
  }
}
