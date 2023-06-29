/* eslint-disable no-unused-vars */

import { StorageManagerProps } from '../../types'
import { UseStorageManager } from '../useStorageManager'

export type UseUploadFilesProps = Pick<
  StorageManagerProps,
  | 'accessLevel'
  | 'maxFileCount'
  | 'onFileRemove'
  | 'onUploadStart'
  | 'onUploadSuccess'
  | 'onUploadError'
> &
  Pick<UseStorageManager, 'files' | 'setUploadSuccess' | 'setUploadingFile'>
