import useSWR, { Fetcher } from 'swr'

import { getProduct } from '@/lib/bruno'
import { Product } from '@/models'

type Data = Product
type Key = string[]

// eslint-disable-next-line no-unused-vars
const fetcher: Fetcher<Data, Key> = async ([_, id]) => {
  return getProduct(id)
}

export default function useGetProduct(id: string) {
  const key = ['product', id]
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
