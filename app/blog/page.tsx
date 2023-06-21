'use client'

import Button from '@mui/material/Button'
import { useSession } from 'next-auth/react'

import logger from '@/lib/logger'
import { get, list, put } from '@/lib/storage'

export default function Page() {
  const session = useSession()
  logger.info('session', session)
  return (
    <>
      Blog
      <div>
        <Button
          onClick={() => {
            put('protected-s3.txt', 'aaa', { level: 'protected' })
          }}
        >
          Protected Upload
        </Button>
      </div>
      <div>
        <Button
          onClick={() => {
            put('public-s3.txt', 'aaa', { level: 'public' })
          }}
        >
          Public Upload
        </Button>
      </div>
      <div>
        <Button
          onClick={() => {
            put('private-s3.txt', 'My name is Harry.', { level: 'private' })
          }}
        >
          Private Upload
        </Button>
      </div>
      <div>
        <Button
          onClick={() => {
            list('', { level: 'private', pageSize: 2 }).then(data =>
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
            list('').then(data => logger.info(data))
          }}
        >
          Public List
        </Button>
      </div>
      <div>
        <Button
          onClick={() => {
            get('private-s3.txt', { level: 'private', download: false }).then(
              url => logger.info(url)
            )
          }}
        >
          Get
        </Button>
      </div>
    </>
  )
}
