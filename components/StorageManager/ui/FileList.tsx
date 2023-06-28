/* eslint-disable no-unused-vars */

import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import NextImage from 'next/image'

import { useScreen } from '@/hooks/useMediaQuery'
import { StorageFile } from '../types'

export interface FileListProps {
  files: StorageFile[]
  onDeleteFile: (params: { id: string }) => void
}

export function FileList({ files, onDeleteFile }: FileListProps) {
  const { screenWidth, isMobile } = useScreen()
  return (
    <ImageList
      sx={{ maxWidth: isMobile ? screenWidth : 600 }}
      cols={isMobile ? 2 : 3}
      rowHeight={isMobile ? screenWidth / 2 : 200}
      gap={isMobile ? 0 : 4}
    >
      {files.map(storageFile => {
        const { id, file } = storageFile
        const thumbnailUrl = file ? URL.createObjectURL(file) : ''
        return (
          <ImageListItem key={id}>
            <NextImage
              src={thumbnailUrl}
              alt={id}
              fill
              priority
              style={{ objectFit: 'contain' }}
            />
            <ImageListItemBar
              sx={{
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                  'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
              }}
              position="top"
              actionIcon={
                <IconButton
                  sx={{ color: 'white' }}
                  aria-label={`delete ${id}`}
                  onClick={() => onDeleteFile({ id })}
                >
                  <DeleteIcon />
                </IconButton>
              }
              actionPosition="right"
            />
          </ImageListItem>
        )
      })}
    </ImageList>
  )
}
