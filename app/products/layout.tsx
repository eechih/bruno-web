'use client'

import Container from '@mui/material/Container'

import { useScreen } from '@/hooks/useMediaQuery'
import { ReactChildren } from '@/lib/types'

export default function Layout({ children }: ReactChildren) {
  const { isMobile } = useScreen()

  return (
    <Container maxWidth="xl" disableGutters={isMobile}>
      {children}
    </Container>
  )
}
