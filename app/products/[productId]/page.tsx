import Link from 'next/link'

import { Box } from '@/components/mui/material'
import { getProduct } from '@/lib/bruno'
import ProductForm from './ProductForm'

export default async function Page({
  params: { productId }
}: {
  params: { productId: string }
}) {
  let product
  if (productId && productId !== 'create') {
    product = await getProduct(productId)
  }
  return (
    <Box>
      Go to <Link href="/products">Products</Link>
      <pre>Product: {JSON.stringify(product, null, 2)}</pre>
      <ProductForm product={product} />
    </Box>
  )
}
