import {
  LoginButton,
  LogoutButton,
  ProfileButton,
  RegisterButton
} from '@/components/buttons.component'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

import User from '@/components/user.component'

export default async function Home() {
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
        <LoginButton />
        <RegisterButton />
        <LogoutButton />
        <ProfileButton />
        <h1>Server Session</h1>
        <pre>{JSON.stringify(session, null, 2)}</pre>

        <User />
      </div>
    </main>
  )
}
