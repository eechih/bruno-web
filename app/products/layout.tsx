'use client'

import Container from '@mui/material/Container'

import { Amigo } from '@/amigo'
import awsExports from '@/aws-exports'
import { ReactChildren } from '@/lib/types'

Amigo.configure(awsExports)

export default function Layout({ children }: ReactChildren) {
  return <Container maxWidth="xl">{children}</Container>
}
