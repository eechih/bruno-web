import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

import { authOptions } from '@/lib/auth'
import logger from '@/lib/logger'

export async function GET(req: NextRequest) {
  const token = await getToken({ req })
  logger.log('GET token', token)
  if (token) {
    // Signed in
    logger.log('JSON Web Token', JSON.stringify(token, null, 2))
  }

  const session = await getServerSession(authOptions)

  return NextResponse.json({ authenticated: !!session, session })
}
