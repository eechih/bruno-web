import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = await getToken({ req })
  console.log('GET token', token)
  if (token) {
    // Signed in
    console.log('JSON Web Token', JSON.stringify(token, null, 2))
  }

  const session = await getServerSession(authOptions)

  return NextResponse.json({ authenticated: !!session, session })
}
