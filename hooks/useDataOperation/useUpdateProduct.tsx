import { useSession } from 'next-auth/react'
import useSWRMutation, {
  MutationFetcher,
  SWRMutationConfiguration
} from 'swr/mutation'

import { API, GRAPHQL_AUTH_MODE } from '@/amigo'
import { updateProductMutation } from '@/graphql/product/mutations'
import { Product, UpdateProductInput, UpdateProductResultData } from '@/models'

type Data = Product
type Error = any
type ExtraArg = { input: UpdateProductInput }
type Key = {
  name: string
  productId: string
  accessToken?: string
}
type SWRData = Product

const fetcher: MutationFetcher<Data, Key, ExtraArg> = async (key, { arg }) => {
  const { accessToken } = key
  const { input } = arg
  const res = await API.graphql<UpdateProductResultData>({
    query: updateProductMutation,
    variables: { input },
    authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    authToken: accessToken
  })
  if (!res.data?.updateProduct) throw new Error('No data returned')
  return res.data.updateProduct
}

const options: SWRMutationConfiguration<Data, Error, Key, ExtraArg, SWRData> = {
  populateCache: (updated, cached) => {
    if (cached) return { ...cached, ...updated }
    return updated
  },
  revalidate: false
}

export function useUpdateProduct(id: string) {
  const session = useSession()
  const key = {
    name: 'product',
    productId: id,
    accessToken: session.data?.accessToken
  }
  const { trigger, isMutating } = useSWRMutation(key, fetcher, options)
  return {
    updateProduct: trigger,
    isMutating
  }
}
