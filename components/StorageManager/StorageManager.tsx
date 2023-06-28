import Box from '@mui/material/Box'
import { useRef } from 'react'

import logger from '@/lib/logger'
import { useStorageManager } from './hooks/useStorageManager'
import { useUploadFiles } from './hooks/useUploadFiles'
import { StorageManagerProps } from './types'
import { FileList } from './ui/FileList'
import { FilePicker } from './ui/FilePicker'

export function StorageManager({
  accessLevel,
  maxFileCount,
  defaultFiles,
  onUploadSuccess,
  onUploadError,
  onUploadStart
}: StorageManagerProps) {
  if (!accessLevel || !maxFileCount) {
    logger.warn('StorageManager requires accessLevel and maxFileCount props')
  }

  const allowMultipleFiles =
    maxFileCount === undefined ||
    (typeof maxFileCount === 'number' && maxFileCount > 1)

  const { files, addFile, removeFile, setUploadingFile, setUploadSuccess } =
    useStorageManager({ defaultFiles })

  useUploadFiles({
    accessLevel,
    files,
    maxFileCount,
    onUploadStart,
    onUploadSuccess,
    onUploadError,
    setUploadingFile,
    setUploadSuccess
  })

  const onFilePickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (!files || files.length === 0) {
      return
    }

    Array.from(files).forEach(file => {
      addFile({ file })
    })
  }

  const hiddenFileInput = useRef<HTMLInputElement>(null)

  function onFilePickerClick() {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click()
      hiddenFileInput.current.value = ''
    }
  }

  return (
    <Box>
      <>
        <FilePicker onClick={onFilePickerClick}>上傳圖片</FilePicker>
        <input
          type="file"
          hidden
          ref={hiddenFileInput}
          multiple={allowMultipleFiles}
          onChange={onFilePickerChange}
          accept="image/*"
        />
      </>
      <FileList files={files} onDeleteFile={removeFile} />
    </Box>
  )
}
