'use client'

import Button from '@mui/material/Button'
import { useSession } from 'next-auth/react'
import * as React from 'react'

import awsExports from '@/aws-exports'
import { StorageImageList } from '@/components/StorageImageList'
import {
  StorageManager,
  StorageManagerHandle
} from '@/components/StorageManager'
import { useScreen } from '@/hooks/useMediaQuery'
import { Storage } from '@/lib/aws'
import { publishProduct } from '@/lib/bruno'

Storage.configure(awsExports)

export default function Page() {
  const session = useSession()
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
      <Button
        onClick={async () => {
          const accessToken = session.data?.accessToken
          const result = await publishProduct({ id: 'test' }, accessToken)
          console.log('result', result)
        }}
      >
        Publish Product
      </Button>
    </>
  )
}
