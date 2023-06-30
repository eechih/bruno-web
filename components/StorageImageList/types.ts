/* eslint-disable no-unused-vars */
import { StorageAccessLevel } from '@/lib/aws/storage'

export interface StorageImageFile {
  key: string
}

export interface StorageImageListProps {
  accessLevel: StorageAccessLevel
  files: StorageImageFile[]
  onFileRemove?: (params: { key: string }) => void
  cols?: number // default: 2
  rowHeight?: number // default: 164
  width?: number
  height?: number
}

export interface StorageImageItemProps {
  accessLevel: StorageAccessLevel
  file: StorageImageFile
  onFileRemove?: (params: { key: string }) => void
}
