import { Storage, StorageAccessLevel } from '@/lib/aws/storage'

export type UploadFileProps = {
  file: File
  key: string
  level: StorageAccessLevel
}

export function uploadFile(props: UploadFileProps): Promise<{ key: string }> {
  const { file, key, level } = props

  return Storage.put(key, file, {
    level
  })
}
