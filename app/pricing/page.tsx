'use client'

import awsExports from '@/aws-exports'
import { StorageManager } from '@/components/StorageManager'
import { Storage } from '@/lib/aws'

export default function Page() {
  Storage.configure(awsExports)

  return (
    <>
      Pricing
      <StorageManager
        accessLevel="public"
        maxFileCount={10}
        onUploadSuccess={({ key }) => console.log('file uploaded', key)}
      />
    </>
  )
}
