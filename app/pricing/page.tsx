'use client'

import Button from '@mui/material/Button'
import * as React from 'react'

import { Amigo } from '@/amigo'
import awsExports from '@/aws-exports'
import { StorageImageList } from '@/components/StorageImageList'
import {
  StorageManager,
  StorageManagerHandle
} from '@/components/StorageManager'
import { useScreen } from '@/hooks/useMediaQuery'

Amigo.configure(awsExports)

export default function Page() {
  const { isMobile } = useScreen()
  const [files, setFiles] = React.useState<{ key: string }[]>([])
  const storageManagerRef = React.useRef<StorageManagerHandle>(null)

  const addFile = ({ key }: { key?: string }) => {
    if (key)
      setFiles(prevFiles => {
        const found = files.find(file => file.key === key)
        if (found) return prevFiles
        else return [...prevFiles, { key }]
      })
  }

  const removeFile = ({ key }: { key: string }) => {
    setFiles(prevFiles => {
      return prevFiles.filter(file => file.key !== key)
    })
  }

  return (
    <>
      Pricing
      <StorageImageList
        accessLevel="public"
        files={files}
        onFileRemove={removeFile}
        width={500}
      />
      <StorageManager
        accessLevel="public"
        maxFileCount={10}
        onUploadSuccess={addFile}
        onFileRemove={removeFile}
        dialogProps={{ fullScreen: isMobile, showTrigger: false }}
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
