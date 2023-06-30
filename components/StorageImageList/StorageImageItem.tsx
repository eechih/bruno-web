/* eslint-disable no-unused-vars */

import BrokenImageIcon from '@mui/icons-material/BrokenImage'
import DeleteIcon from '@mui/icons-material/Delete'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import Stack from '@mui/material/Stack'
import NextImage from 'next/image'

import { useStorageURL } from '@/hooks/useStorageURL'
import { StorageImageItemProps } from './types'

export function StorageImageItem(props: StorageImageItemProps) {
  const {
    accessLevel,
    file: { key },
    onFileRemove
  } = props

  const { url, error, isLoading } = useStorageURL({
    key,
    options: { level: accessLevel }
  })

  return (
    <ImageListItem>
      {(url && (
        <NextImage
          src={url}
          alt={key}
          priority
          fill
          style={{ objectFit: 'cover', backgroundColor: '#ddd' }}
        />
      )) || (
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{
            width: '100%',
            height: '100%',
            backgroundColor: '#ddd'
          }}
        >
          {isLoading && <CircularProgress color="inherit" size={16} />}
          {error && <BrokenImageIcon />}
        </Stack>
      )}

      <ImageListItemBar
        sx={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
        }}
        title={key}
        actionIcon={
          onFileRemove && (
            <IconButton
              sx={{ color: 'white' }}
              aria-label="remove image"
              onClick={() => onFileRemove({ key })}
            >
              <DeleteIcon />
            </IconButton>
          )
        }
        actionPosition="right"
        position="top"
      />
    </ImageListItem>
  )
}
