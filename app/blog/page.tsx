'use client'

import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Tooltip from '@mui/material/Tooltip'
import NextImage from 'next/image'
import { FormEvent, useState } from 'react'

import { Amigo, Storage } from '@/amigo'
import awsExports from '@/aws-exports'
import logger from '@/lib/logger'

Amigo.configure(awsExports)

export default function Page() {
  const [imageUrls, setImageUrls] = useState<string[]>([])

  const handleFileUpload = (event: FormEvent<HTMLInputElement>) => {
    const { files } = event.target as HTMLInputElement
    if (files) {
      console.log('files', files)
      Array.from(files).forEach(file => {
        console.log('file', file)
        const reader = new FileReader()

        reader.onloadend = () => {
          const imageUrl = reader.result as string
          setImageUrls(prevState => [...prevState, imageUrl])
        }

        Storage.put(file.name, file, {
          level: 'private'
        })

        reader.readAsDataURL(file)
      })
    }
  }

  return (
    <>
      Blog
      <div>
        <Button
          onClick={() => {
            Storage.put('protected-s3.txt', 'aaa', { level: 'protected' })
          }}
        >
          Protected Upload
        </Button>
      </div>
      <div>
        <Button
          onClick={() => {
            Storage.put('public-s3.txt', 'aaa', { level: 'public' })
          }}
        >
          Public Upload
        </Button>
      </div>
      <div>
        <Button
          onClick={() => {
            Storage.put('private-s3.txt', 'My name is Harry.', {
              level: 'private'
            })
          }}
        >
          Private Upload
        </Button>
      </div>
      <div>
        <Button
          onClick={() => {
            Storage.list('', { level: 'private' }).then(data =>
              logger.info(data)
            )
          }}
        >
          Private List
        </Button>
      </div>
      <div>
        <Button
          onClick={() => {
            Storage.list('').then(data => logger.info(data))
          }}
        >
          Public List
        </Button>
      </div>
      <div>
        <Button
          onClick={() => {
            Storage.get('private-s3.txt', {
              level: 'private',
              download: true
            }).then(url => logger.info(url))
          }}
        >
          Get
        </Button>
      </div>
      <div>
        <Button
          onClick={() => {
            Storage.remove('private-s3.txt', { level: 'private' }).then(data =>
              logger.info(data)
            )
          }}
        >
          Private Delete
        </Button>
      </div>
      <div>
        <Tooltip title="上傳圖片">
          <IconButton
            aria-label="upload photo"
            color="primary"
            component="label"
          >
            <input
              hidden
              accept="image/*"
              multiple
              type="file"
              onChange={handleFileUpload}
            />
            <PhotoCameraIcon />
          </IconButton>
        </Tooltip>
      </div>
      <div>
        <ImageList sx={{ width: 600, minHeight: 400 }} cols={3} rowHeight={200}>
          {imageUrls.map((imageUrl, index) => (
            <ImageListItem key={index}>
              <NextImage
                src={imageUrl}
                alt="photo"
                fill
                priority
                style={{ objectFit: 'contain' }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
    </>
  )
}
