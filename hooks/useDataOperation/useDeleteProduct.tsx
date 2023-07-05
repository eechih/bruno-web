import { useSession } from 'next-auth/react'
import useSWRMutation, {
  MutationFetcher,
  SWRMutationConfiguration
} from 'swr/mutation'

import { API, GRAPHQL_AUTH_MODE } from '@/amigo'
import { deleteProductMutation } from '@/graphql/product/mutations'
import {
  DeleteProductInput,
  DeleteProductResultData,
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
type ExtraArg = { input: DeleteProductInput }
type SWRData = ProductConnection

const fetcher: MutationFetcher<Data, Key, ExtraArg> = async (key, { arg }) => {
  const { accessToken } = key
  const { input } = arg
  const res = await API.graphql<DeleteProductResultData>({
    query: deleteProductMutation,
    variables: { input },
    authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    authToken: accessToken
  })
  if (!res.data?.deleteProduct) throw new Error('No data returned')
  return res.data.deleteProduct
}

const options: SWRMutationConfiguration<Data, Error, Key, ExtraArg, SWRData> = {
  populateCache: (deleted, cached) => {
    if (cached) {
      return {
        ...cached,
        items: cached.items.filter(product => product.id !== deleted.id)
      }
    }
    return { items: [] }
  },
  revalidate: false
}

export function useDeleteProduct() {
  const session = useSession()
  const key = {
    name: 'products',
    nextToken: undefined,
    accessToken: session.data?.accessToken
  }
  const { trigger, isMutating } = useSWRMutation(key, fetcher, options)
  return {
    deleteProduct: trigger,
    isDeleting: isMutating
  }
}
