'use client'

import Link from 'next/link'

import ProductEntry from '@/components/ProductEntry'
import { Box, Button, Unstable_Grid2 as Grid } from '@/components/mui/material'

import useListProducts from '@/hooks/useListProducts'

export default function Page() {
  const { products, productsLoading } = useListProducts()

  if (productsLoading) return 'Loading...'

  return (
    <Box>
      <Button LinkComponent={Link} href="/products/create">
        Create Product
      </Button>
      {products && (
        <div>
          <Grid container spacing={2}>
            {products.map(product => {
              return (
                <Grid key={product.id} xs={12} sm={6} md={4} lg={3} xl={3}>
                  <ProductEntry id={product.id} />
                </Grid>
              )
            })}
          </Grid>
          <Button>載入更多</Button>
        </div>
      )}
    </Box>
  )
}
