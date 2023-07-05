import { useSession } from 'next-auth/react'
import useSWR, { Fetcher } from 'swr'

import { API, GRAPHQL_AUTH_MODE } from '@/amigo'
import { listProductsQuery } from '@/graphql/product/queries'
import { ListProductsResultData, ProductConnection } from '@/models'

type Data = ProductConnection
type Key = {
  name: string
  nextToken?: string
  accessToken?: string
}

// eslint-disable-next-line no-unused-vars
const fetcher: Fetcher<Data, Key> = async key => {
  const { accessToken } = key
  const res = await API.graphql<ListProductsResultData>({
    query: listProductsQuery,
    variables: {},
    authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    authToken: accessToken
  })
  if (!res.data?.listProducts) throw new Error('No data returned')
  return res.data.listProducts
}

export function useListProducts(nextToken?: string) {
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
