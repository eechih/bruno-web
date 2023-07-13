import { useEffect } from 'react'

import { FileStatus } from '../../types'
import { uploadFile } from '../../utils/uploadFile'
import { UseUploadFilesProps } from './types'

export function useUploadFiles(props: UseUploadFilesProps) {
  const {
    files,
    accessLevel,
    maxFileCount,
    onUploadSuccess,
    setUploadSuccess,
    setUploadingFile
  } = props

  useEffect(() => {
    const filesReadyToUpload = files.filter(
      file => file.status === FileStatus.QUEUED
    )

    if (filesReadyToUpload.length > maxFileCount) {
      return
    }

    for (const { file, key, id } of filesReadyToUpload) {
      if (file) {
        uploadFile({ file, key, level: accessLevel }).then(
          ({ key: finalKey }) => {
            onUploadSuccess?.({ key: finalKey })
            setUploadSuccess({ id })
          }
        )
        setUploadingFile({ id })
      }
    }
  }, [
    files,
    accessLevel,
    maxFileCount,
    setUploadSuccess,
    setUploadingFile,
    onUploadSuccess
  ])
}
