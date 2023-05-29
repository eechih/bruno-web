import { Container } from '@/components/mui/material'
import { ReactChildren } from '@/lib/types'

export default function Layout({ children }: ReactChildren) {
  return (
    <Container maxWidth="xl" sx={{ backgroundColor: '#fafafa' }}>
      {children}
    </Container>
  )
}
