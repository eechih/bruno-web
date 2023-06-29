'use client'

import Button from '@mui/material/Button'
import * as React from 'react'

import awsExports from '@/aws-exports'
import {
  StorageManager,
  StorageManagerHandle
} from '@/components/StorageManager'
import { useScreen } from '@/hooks/useMediaQuery'
import { Storage } from '@/lib/aws'

Storage.configure(awsExports)

export default function Page() {
  const { isMobile } = useScreen()
  const storageManagerRef = React.useRef<StorageManagerHandle>(null)
  const defaultFiles = [
    { key: 'mockfile1' },
    { key: 'mockfile2' },
    { key: 'mockfile3' }
    // { key: 'mockfile4' },
    // { key: 'mockfile5' }
  ]

  return (
    <>
      Pricing
      <StorageManager
        accessLevel="public"
        defaultFiles={defaultFiles}
        maxFileCount={10}
        onUploadSuccess={({ key }) => console.log('file uploaded', key)}
        dialogProps={{ fullScreen: isMobile, showTrigger: false }}
        imageListProps={{ width: 500 }}
        ref={storageManagerRef}
      />
      <Button
        onClick={() => {
          storageManagerRef.current?.openDialog()
        }}
      >
        Open Storage Manager
      </Button>
      <Button
        onClick={() => {
          storageManagerRef.current?.closeDialog()
        }}
      >
        Close Storage Manager
      </Button>
      <Button
        onClick={() => {
          storageManagerRef.current?.clearFiles()
        }}
      >
        Clear Files
      </Button>
    </>
  )
}
