import useSWR, { Fetcher } from 'swr'

import { listProducts } from '@/lib/bruno'
import { ProductConnection } from '@/models'

type Data = ProductConnection
type Key = string[]

// eslint-disable-next-line no-unused-vars
const fetcher: Fetcher<Data, Key> = async () => listProducts(undefined)

export default function useListProducts() {
  const key = ['products']
  const options = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  }
  const { data, isLoading, mutate } = useSWR(key, fetcher, options)

  return {
    products: data?.items,
    nextToken: data?.nextToken,
    productsLoading: isLoading,
    mutateProducts: mutate
  }
}
