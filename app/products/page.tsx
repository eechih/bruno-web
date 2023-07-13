'use client'

import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from 'next/link'

import Breadcrumbs from '@/components/Breadcrumbs'
import ProductGrid from '@/components/product/ProductGrid'
import ProductTable from '@/components/product/ProductTable'
import { useListProducts } from '@/hooks/useDataOperation'
import { useScreen } from '@/hooks/useMediaQuery'

export default function Page() {
  const { products, productsLoading } = useListProducts()
  const { isMobile } = useScreen()

  if (productsLoading) return 'Loading...'

  return (
    <>
      <Box sx={{ mb: 5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack>
            <Typography variant="h6" gutterBottom>
              產品列表
            </Typography>
            <Breadcrumbs
              breadcrumbs={[
                { label: '首頁', href: '/' },
                { label: '產品列表' }
              ]}
            />
          </Stack>
          <Stack>
            <Button
              variant="contained"
              LinkComponent={Link}
              startIcon={<AddIcon />}
              href="/products/create"
            >
              新增產品
            </Button>
          </Stack>
        </Stack>
      </Box>
      {isMobile && <ProductGrid products={products} />}
      {!isMobile && <ProductTable products={products} />}
    </>
  )
}
