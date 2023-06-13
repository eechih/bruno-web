'use client'

import { useSession } from 'next-auth/react'

export default function User() {
  const { data: session, status } = useSession({ required: true })

  if (status === 'loading') {
    return <>Loading or not authenticated...</>
  }

  return (
    <>
      <h1>Client Session</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </>
  )
}
