/* eslint-disable no-unused-vars */

import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import MuiImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'

import { FileThumbnail } from '../FileThumbnail'
import { ImageListProps } from './types'

export function ImageList(props: ImageListProps) {
  const {
    files,
    onDeleteUpload,
    cols = 2,
    rowHeight = 164,
    width,
    height
  } = props

  return (
    <MuiImageList
      sx={{ width: width, height: height }}
      cols={cols}
      rowHeight={rowHeight}
    >
      {files.map(({ id, key, file, isImage }) => {
        const thumbnailUrl = file && isImage ? URL.createObjectURL(file) : ''

        return (
          <ImageListItem key={key}>
            {true && (
              <FileThumbnail
                isImage={isImage}
                fileName={key}
                url={thumbnailUrl}
              />
            )}
            {true && onDeleteUpload && (
              <ImageListItemBar
                sx={{
                  background:
                    'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                    'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
                }}
                title={key}
                actionIcon={
                  <IconButton
                    sx={{ color: 'white' }}
                    aria-label="delete image"
                    onClick={() => onDeleteUpload({ id })}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
                actionPosition="right"
                position="top"
              />
            )}
          </ImageListItem>
        )
      })}
    </MuiImageList>
  )
}
