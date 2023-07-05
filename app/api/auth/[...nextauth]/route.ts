import { authOptions } from '@/lib/auth'
import NextAuth from 'next-auth'

import { Amigo } from '@/amigo'
import awsExports from '@/aws-exports'

Amigo.configure(awsExports)
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
