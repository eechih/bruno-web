import { useSession } from 'next-auth/react'
import useSWR, { Fetcher } from 'swr'

import { listProducts } from '@/lib/bruno'
import { ProductConnection } from '@/models'

type Data = ProductConnection
type Key = {
  name: string
  nextToken?: string
  accessToken?: string
}

// eslint-disable-next-line no-unused-vars
const fetcher: Fetcher<Data, Key> = async key => {
  return listProducts(key.nextToken, key.accessToken)
}

export default function useListProducts(nextToken?: string) {
  const session = useSession()
  const key = {
    name: 'products',
    accessToken: session.data?.accessToken,
    nextToken
  }
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
