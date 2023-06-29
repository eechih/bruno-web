/* eslint-disable no-unused-vars */

import FileIcon from '@mui/icons-material/Description'
import Stack from '@mui/material/Stack'
import NextImage from 'next/image'

import { FileThumbnailProps } from './types'

export function FileThumbnail(props: FileThumbnailProps) {
  const { fileName, url, isImage, size = 'inherit' } = props

  let imageFill: boolean = false
  let width: number | undefined = undefined
  let height: number | undefined = undefined

  if (size === 'small') {
    width = 60
    height = 40
  } else if (size === 'large') {
    width = 246
    height = 164
  } else {
    imageFill = true
  }

  return isImage ? (
    <NextImage
      src={url}
      alt={fileName}
      priority
      fill={imageFill}
      width={width}
      height={height}
      style={{ objectFit: 'cover', backgroundColor: '#ddd' }}
    />
  ) : (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{
        width: width ?? '100%',
        height: height ?? '100%',
        backgroundColor: '#ddd'
      }}
    >
      <FileIcon />
    </Stack>
  )
}
