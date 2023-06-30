'use client'

import Container from '@mui/material/Container'

import awsExports from '@/aws-exports'
import { Storage } from '@/lib/aws'
import { ReactChildren } from '@/lib/types'

Storage.configure(awsExports)

export default function Layout({ children }: ReactChildren) {
  return <Container maxWidth="xl">{children}</Container>
}
