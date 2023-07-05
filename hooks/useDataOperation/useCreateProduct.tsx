import { useSession } from 'next-auth/react'
import useSWRMutation, {
  MutationFetcher,
  SWRMutationConfiguration
} from 'swr/mutation'

import { API, GRAPHQL_AUTH_MODE } from '@/amigo'
import { createProductMutation } from '@/graphql/product/mutations'
import {
  CreateProductInput,
  CreateProductResultData,
  Product,
  ProductConnection
} from '@/models'

type Data = Product
type Error = any
type Key = { name: string; nextToken?: string; accessToken?: string }
type ExtraArg = { input: CreateProductInput }
type SWRData = ProductConnection

const fetcher: MutationFetcher<Data, Key, ExtraArg> = async (key, { arg }) => {
  const { accessToken } = key
  const { input } = arg
  const res = await API.graphql<CreateProductResultData>({
    query: createProductMutation,
    variables: { input },
    authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    authToken: accessToken
  })
  if (!res.data?.createProduct) throw new Error('No data returned')
  return res.data.createProduct
}

const options: SWRMutationConfiguration<Data, Error, Key, ExtraArg, SWRData> = {
  populateCache: (created, cached) => {
    if (cached) {
      return { ...cached, items: [created, ...cached.items] }
    }
    return { items: [created] }
  },
  revalidate: false
}

export function useCreateProduct() {
  const session = useSession()
  const key = {
    name: 'products',
    nextToken: undefined,
    accessToken: session.data?.accessToken
  }
  const { trigger, isMutating } = useSWRMutation(key, fetcher, options)
  return {
    createProduct: trigger,
    isMutating
  }
}
