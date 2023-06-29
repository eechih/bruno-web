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

  return (
    <>
      Pricing
      <StorageManager
        accessLevel="public"
        maxFileCount={10}
        onUploadSuccess={({ key }) => console.log('file uploaded', key)}
        dialog={{ enabled: true, fullScreen: isMobile, showTrigger: false }}
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
    </>
  )
}
