import { notFound } from 'next/navigation'

import { listProducts } from '@/lib/bruno'

export default async function Page() {
  const products = await listProducts()

  // No products? Bail...
  if (!products) {
    notFound()
  }
  return <pre>Products: {JSON.stringify(products, null, 2)}</pre>
}
