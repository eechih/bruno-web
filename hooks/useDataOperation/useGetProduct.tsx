import { useSession } from 'next-auth/react'
import useSWR, { Fetcher } from 'swr'

import { API, GRAPHQL_AUTH_MODE } from '@/amigo'
import { getProductQuery } from '@/graphql/product/queries'
import { GetProductResultData, Product } from '@/models'

type Data = Product
type Key = {
  name: string
  productId: string
  accessToken?: string
}

// eslint-disable-next-line no-unused-vars
const fetcher: Fetcher<Data, Key> = async key => {
  const { productId, accessToken } = key
  const res = await API.graphql<GetProductResultData>({
    query: getProductQuery,
    variables: { id: productId },
    authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    authToken: accessToken
  })
  if (!res.data?.getProduct) throw new Error('No data returned')
  return res.data.getProduct
}

export function useGetProduct(id: string) {
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
