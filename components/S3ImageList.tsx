/* eslint-disable no-unused-vars */

import * as React from 'react'

import ImageList, { Image } from '@/components/ImageList'
import { Storage } from '@/lib/aws'

export interface S3ImageListProps {
  keys: string[]
  onRemoveImage?: (event: Pick<Image, 'key'>) => void
}

type ImageWithError = Image & { error?: string }
export default function S3ImageList({ keys, onRemoveImage }: S3ImageListProps) {
  const [images, setImages] = React.useState<
    Record<string, { key: string; src?: string; error?: string }>
  >({})

  React.useEffect(() => {
    keys.forEach(async (key, index) => {
      if (!images[key]) {
        Storage.get(key, {
          level: 'private'
        })
          .then(url => {
            setImages(prevImages => {
              return { ...prevImages, [key]: { key, src: url } }
            })
          })
          .catch(error => {
            setImages(prevImages => {
              return {
                ...prevImages,
                [key]: { key, error: 'Failed to get image from S3' }
              }
            })
          })
      }
    })
  }, [keys, images, setImages])

  return (
    <>
      <pre>{JSON.stringify(keys, null, 2)}</pre>
      <ImageList
        images={Object.entries(images).map(([k, v]) => v)}
        onRemoveImage={onRemoveImage}
      />
    </>
  )
}
