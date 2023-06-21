'use client'

import Button from '@mui/material/Button'
import { useSession } from 'next-auth/react'

import logger from '@/lib/logger'
import { Storage } from '@/lib/storage'

Storage.configure({
  region: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_REGION!,
  bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!
})

export default function Page() {
  const session = useSession()
  logger.info('session', session)
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
    </>
  )
}
