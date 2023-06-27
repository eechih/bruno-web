'use client'

import Container from '@mui/material/Container'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { ReactChildren } from '@/lib/types'

export default function Layout({ children }: ReactChildren) {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.only('xs'))

  return (
    <Container maxWidth="xl" disableGutters={matches}>
      {children}
    </Container>
  )
}
