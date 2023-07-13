'use client'

import ProductForm from '@/components/product/ProductForm'
import { useGetProduct } from '@/hooks/useDataOperation'

type PageProps = {
  params: { productId: string }
}

export default function Page({ params: { productId } }: PageProps) {
  const { product, productLoading } = useGetProduct(productId)

  if (productLoading) return 'Loading...'

  return <>{product && <ProductForm product={product} />}</>
}
