import { useSession } from 'next-auth/react'
import useSWRMutation, {
  MutationFetcher,
  SWRMutationConfiguration
} from 'swr/mutation'

import { API, GRAPHQL_AUTH_MODE } from '@/amigo'
import { asyncPublishProductMutation } from '@/graphql/product/mutations'
import {
  AsyncPublishProductInput,
  AsyncPublishProductResultData,
  Product,
  ProductConnection
} from '@/models'

type Data = Product
type Error = any
type Key = {
  name: string
  nextToken?: string
  accessToken?: string
}
type ExtraArg = { input: AsyncPublishProductInput }
type SWRData = ProductConnection

const fetcher: MutationFetcher<Data, Key, ExtraArg> = async (key, { arg }) => {
  const { accessToken } = key
  const { input } = arg
  const res = await API.graphql<AsyncPublishProductResultData>({
    query: asyncPublishProductMutation,
    variables: { input },
    authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    authToken: accessToken
  })
  if (!res.data?.asyncPublishProduct) throw new Error('No data returned')
  return res.data.asyncPublishProduct
}

const options: SWRMutationConfiguration<Data, Error, Key, ExtraArg, SWRData> = {
  populateCache: (updated, cached) => {
    if (cached) {
      return {
        ...cached,
        items: cached.items.map(product => {
          if (product.id === updated.id) {
            return { ...product, ...updated }
          } else {
            return product
          }
        })
      }
    }
    return { items: [updated] }
  },
  revalidate: false
}

export function usePublishProduct() {
  const session = useSession()
  const key = {
    name: 'products',
    nextToken: undefined,
    accessToken: session.data?.accessToken
  }
  const { trigger, isMutating } = useSWRMutation(key, fetcher, options)
  return {
    publishProduct: trigger,
    isPublishing: isMutating
  }
}
