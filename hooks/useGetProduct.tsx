import { useSession } from 'next-auth/react'
import useSWR, { Fetcher } from 'swr'

import { getProduct } from '@/lib/bruno'
import { Product } from '@/models'

type Data = Product
type Key = {
  name: string
  productId: string
  accessToken?: string
}

// eslint-disable-next-line no-unused-vars
const fetcher: Fetcher<Data, Key> = async key => {
  return getProduct(key.productId, key.accessToken)
}

export default function useGetProduct(id: string) {
  const session = useSession()
  const key = {
    name: 'product',
    productId: id,
    accessToken: session.data?.accessToken
  }
  const options = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  }
  const { data, isLoading, mutate } = useSWR(key, fetcher, options)
  return {
    product: data ?? null,
    productLoading: isLoading,
    mutateProduct: mutate
  }
}
