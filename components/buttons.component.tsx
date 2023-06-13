'use client'

import { signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export const LoginButton = () => {
  return (
    <button style={{ marginRight: 10 }} onClick={() => signIn()}>
      Sign in
    </button>
  )
}

export const RegisterButton = () => {
  return (
    <Link href="/register" style={{ marginRight: 10 }}>
      Register
    </Link>
  )
}

export const LogoutButton = () => {
  const router = useRouter()
  return (
    <button
      style={{ marginRight: 10 }}
      onClick={() =>
        signOut({ callbackUrl: '/', redirect: false }).then(data => {
          router.push(data.url)
          alert('登出成功')
        })
      }
    >
      Sign Out
    </button>
  )
}

export const ProfileButton = () => {
  return <Link href="/profile">Profile</Link>
}
