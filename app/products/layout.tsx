'use client'

import Container from '@mui/material/Container'

import awsExports from '@/aws-exports'
import { useScreen } from '@/hooks/useMediaQuery'
import { Storage } from '@/lib/aws'
import { ReactChildren } from '@/lib/types'

Storage.configure(awsExports)

export default function Layout({ children }: ReactChildren) {
  const { isMobile } = useScreen()

  return (
    <Container maxWidth="xl" disableGutters={isMobile}>
      {children}
    </Container>
  )
}
