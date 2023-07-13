import Grid from '@mui/material/Unstable_Grid2'

import { Product } from '@/models'
import ProductEntry from './ProductEntry'

export interface ProductGridProps {
  products?: Pick<Product, 'id'>[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <Grid container spacing={2}>
      {products &&
        products.map((product, index) => (
          <Grid xs={12} key={index}>
            <ProductEntry id={product.id} />
          </Grid>
        ))}
    </Grid>
  )
}
