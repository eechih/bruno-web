import BrokenImageIcon from '@mui/icons-material/BrokenImage'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import NextImage from 'next/image'

import useStorageURL from '@/hooks/useStorageURL'

interface ProductThumbnailProps {
  file: { key: string }
}

export default function ProductThumbnail({
  file: { key }
}: ProductThumbnailProps) {
  const { url, error, isLoading } = useStorageURL(key, 'private')
  if (isLoading) return <Skeleton variant="rectangular" height={64} />
  if (error)
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{
          width: 64,
          height: 64,
          backgroundColor: '#ddd'
        }}
      >
        <BrokenImageIcon />
      </Stack>
    )
  return (
    <NextImage
      src={url || ''}
      alt={key}
      priority
      width={64}
      height={64}
      style={{
        objectFit: 'cover',
        backgroundColor: '#ddd',
        borderRadius: '12px'
      }}
    />
  )
}
