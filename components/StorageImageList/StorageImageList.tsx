/* eslint-disable no-unused-vars */

import ImageList from '@mui/material/ImageList'

import { StorageImageItem } from './StorageImageItem'
import { StorageImageListProps } from './types'

export function StorageImageList(props: StorageImageListProps) {
  const {
    accessLevel,
    files,
    onFileRemove,
    cols = 2,
    rowHeight = 164,
    width,
    height
  } = props

  return (
    <ImageList
      sx={{ width: width, height: height }}
      cols={cols}
      rowHeight={rowHeight}
    >
      {files.map((file, index) => {
        return (
          <StorageImageItem
            accessLevel={accessLevel}
            file={file}
            onFileRemove={onFileRemove}
            key={index}
          />
        )
      })}
    </ImageList>
  )
}
