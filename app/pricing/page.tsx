'use client'

import awsExports from '@/aws-exports'
import { StorageManager } from '@/components/StorageManager'
import { useScreen } from '@/hooks/useMediaQuery'
import { Storage } from '@/lib/aws'

Storage.configure(awsExports)

export default function Page() {
  const { isMobile } = useScreen()
  return (
    <>
      Pricing
      <StorageManager
        accessLevel="public"
        maxFileCount={10}
        onUploadSuccess={({ key }) => console.log('file uploaded', key)}
        dialogEnabled
        dialogFullScreen={isMobile}
      />
    </>
  )
}
