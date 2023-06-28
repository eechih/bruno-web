/* eslint-disable no-unused-vars */

import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import MuiImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import NextImage from 'next/image'

import { useScreen } from '@/hooks/useMediaQuery'

export interface Image {
  key: string
  src?: string
}

export interface ImageListProps {
  images: Image[]
  onRemoveImage?: (event: Pick<Image, 'key'>) => void
}

export default function ImageList({ images, onRemoveImage }: ImageListProps) {
  const { isMobile, screenWidth } = useScreen()

  return (
    <MuiImageList
      sx={{ maxWidth: isMobile ? screenWidth : 600 }}
      cols={isMobile ? 2 : 3}
      rowHeight={isMobile ? screenWidth / 2 : 200}
      gap={isMobile ? 0 : 4}
    >
      {images.map(({ key, src }, index) => {
        if (src) {
          return (
            <ImageListItem key={index}>
              <NextImage
                src={src}
                alt="photo"
                fill
                priority
                style={{ objectFit: 'contain' }}
              />
              {onRemoveImage && (
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
                      aria-label={`delete ${key}`}
                      onClick={() => onRemoveImage({ key })}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  actionPosition="right"
                />
              )}
            </ImageListItem>
          )
        }
      })}
    </MuiImageList>
  )
}
