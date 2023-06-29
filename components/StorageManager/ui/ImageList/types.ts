/* eslint-disable no-unused-vars */

import { StorageFile } from '../../types'

export interface ImageListProps {
  files: StorageFile[]
  onDeleteUpload?: (params: { id: string }) => void
  cols?: number // default: 2
  rowHeight?: number // default: 164
  width?: number
  height?: number
}
