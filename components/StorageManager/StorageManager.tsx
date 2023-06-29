import Box from '@mui/material/Box'
import * as React from 'react'

import logger from '@/lib/logger'
import { useStorageManager } from './hooks/useStorageManager/useStorageManager'
import { useUploadFiles } from './hooks/useUploadFiles/useUploadFiles'
import { StorageManagerHandle, StorageManagerProps } from './types'
import { Dialog, DialogHandle } from './ui/Dialog'
import { FileList } from './ui/FileList'
import { FilePicker } from './ui/FilePicker'
import { ImageList } from './ui/ImageList'

function StorageManagerBase(
  props: StorageManagerProps,
  ref: React.ForwardedRef<StorageManagerHandle>
) {
  const {
    acceptedFileTypes = [],
    accessLevel,
    maxFileCount,
    defaultFiles,
    isResumable = false,
    onFileRemove,
    onUploadSuccess,
    onUploadError,
    onUploadStart,
    showThumbnails = true,
    dialogEnabled = true,
    dialogProps,
    showImageList = true,
    imageListProps = { enabled: true }
  } = props

  if (!accessLevel || !maxFileCount) {
    logger.warn('StorageManager requires accessLevel and maxFileCount props')
  }

  const allowMultipleFiles =
    maxFileCount === undefined ||
    (typeof maxFileCount === 'number' && maxFileCount > 1)

  const {
    addFiles,
    clearFiles,
    setUploadingFile,
    setUploadSuccess,
    removeUpload,
    files
  } = useStorageManager({ defaultFiles })

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

  const hiddenFileInput = React.useRef<HTMLInputElement>(null)
  const dialogRef = React.useRef<DialogHandle>(null)

  React.useImperativeHandle(ref, () => ({
    clearFiles,
    openDialog: () => {
      dialogRef.current?.open()
    },
    closeDialog: () => {
      dialogRef.current?.close()
    }
  }))

  const onFilePickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (!files || files.length === 0) {
      return
    }
    addFiles({ files: Array.from(files) })
  }

  function onFilePickerClick() {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click()
      hiddenFileInput.current.value = ''
    }
  }

  const onDeleteUpload = ({ id }: { id: string }) => {
    removeUpload({ id })
    if (typeof onFileRemove === 'function') {
      const file = files.find(file => file.id === id)
      if (file) {
        onFileRemove({ key: file.key })
      }
    }
  }

  const notImplementedFunction = () => {}

  return (
    <Box>
      <Dialog {...dialogProps} enabled={dialogEnabled} ref={dialogRef}>
        <Box>
          <FilePicker onClick={onFilePickerClick} />
          <input
            type="file"
            hidden
            ref={hiddenFileInput}
            multiple={allowMultipleFiles}
            onChange={onFilePickerChange}
            accept={acceptedFileTypes.join(',')}
          />
          <Box sx={{ marginTop: 2 }}>
            <FileList
              files={files}
              isResumable={isResumable}
              onCancelUpload={notImplementedFunction}
              onDeleteUpload={onDeleteUpload}
              onResume={notImplementedFunction}
              onPause={notImplementedFunction}
              showThumbnails={showThumbnails}
              hasMaxFilesError={false}
              maxFileCount={maxFileCount}
            />
          </Box>
        </Box>
      </Dialog>
      {showImageList && (
        <ImageList
          {...imageListProps}
          files={files}
          onDeleteUpload={onDeleteUpload}
        />
      )}
    </Box>
  )
}

const StorageManager = React.forwardRef<
  StorageManagerHandle,
  StorageManagerProps
>(StorageManagerBase)

export { StorageManager }
