/* eslint-disable no-unused-vars */

import { StorageFile } from '../../types'

export type ImageFile = Pick<
  StorageFile,
  'id' | 'file' | 'status' | 'key' | 'error'
>

export interface FileThumbnailProps {
  fileName: string
  url: string
  isImage: boolean
  size?: 'inherit' | 'small' | 'large' // default: inherit
}
