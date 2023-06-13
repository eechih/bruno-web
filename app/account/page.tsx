import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

import User from '@/components/user.component'

export default async function Account() {
  const session = await getServerSession(authOptions)

  return (
    <main
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh'
      }}
    >
      <div>
        <h1>Server Session</h1>
        <pre>{JSON.stringify(session, null, 2)}</pre>
        <User />
      </div>
    </main>
  )
}
