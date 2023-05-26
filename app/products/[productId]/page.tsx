import { notFound } from 'next/navigation'

import { getProduct } from '@/lib/bruno'

export default async function Page({
  params: { productId }
}: {
  params: { productId: string }
}) {
  const product = await getProduct(productId)

  // No product? Bail...
  if (!product) {
    notFound()
  }
  return <pre>Product: {JSON.stringify(product, null, 2)}</pre>
}
