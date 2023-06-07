'use client'

import ProductForm, { convertToInputs } from '@/components/ProductForm'
import useGetProduct from '@/hooks/useGetProduct'

type PageProps = {
  params: { productId: string }
}

export default function Page({ params: { productId } }: PageProps) {
  const { product, productLoading } = useGetProduct(productId)

  if (productLoading) return 'Loading...'

  return (
    <>{product && <ProductForm initialValues={convertToInputs(product)} />}</>
  )
}
