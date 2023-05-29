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
  return <ProductForm product={product} />
}
