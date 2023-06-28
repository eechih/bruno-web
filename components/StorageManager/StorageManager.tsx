import Box from '@mui/material/Box'
import * as React from 'react'

import logger from '@/lib/logger'
import { useStorageManager } from './hooks/useStorageManager'
import { useUploadFiles } from './hooks/useUploadFiles'
import { StorageManagerProps } from './types'
import { Dialog } from './ui/Dialog'
import { FileList } from './ui/FileList'
import { FilePicker } from './ui/FilePicker'

export function StorageManager({
  accessLevel,
  maxFileCount,
  defaultFiles,
  onFileRemove,
  onUploadSuccess,
  onUploadError,
  onUploadStart,
  dialogEnabled,
  dialogFullScreen
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
    onFileRemove,
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

  const hiddenFileInput = React.useRef<HTMLInputElement>(null)

  function onFilePickerClick() {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click()
      hiddenFileInput.current.value = ''
    }
  }

  const hanldeDeleteFile = ({ id }: { id: string }) => {
    removeFile({ id })
    if (typeof onFileRemove === 'function') {
      const file = files.find(file => file.id === id)
      if (file) {
        onFileRemove({ key: file.key })
      }
    }
  }

  const main = (
    <Box sx={{ padding: dialogEnabled ? 0 : 0 }}>
      <FilePicker onClick={onFilePickerClick}>上傳圖片</FilePicker>
      <input
        type="file"
        hidden
        ref={hiddenFileInput}
        multiple={allowMultipleFiles}
        onChange={onFilePickerChange}
        accept="image/*"
      />
      <Box sx={{ marginTop: 2 }}>
        <FileList files={files} onDeleteFile={hanldeDeleteFile} />
      </Box>
    </Box>
  )

  if (dialogEnabled)
    return <Dialog fullScreen={dialogFullScreen}>{main}</Dialog>
  else return main
}
