'use client'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import Button from '@mui/material/Button'
import { useSession } from 'next-auth/react'

const BUCKET_NAME = 'bruno-bucket83908e77-1kbjojz6gr7ho'
const REGION_NAME = 'us-east-1'

export default function Page() {
  const session = useSession()
  console.log('session', session)

  const {
    identityId,
    credentials: {
      accessKeyId = '',
      secretKey: secretAccessKey = '',
      sessionToken
    }
  } = session.data ?? { credentials: {} }

  const upload = async () => {
    const client = new S3Client({
      region: REGION_NAME,
      credentials: {
        accessKeyId,
        secretAccessKey,
        sessionToken
      }
    })

    console.log('upload')
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      // Key: 'public/hello-s3.txt',
      Key: `private/${identityId}/hello2-s3.txt`,
      Body: 'Hello S3!'
    })

    try {
      const response = await client.send(command)
      console.log(response)
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <>
      Blog
      <Button onClick={upload}>Upload</Button>
    </>
  )
}
