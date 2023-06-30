import { useSession } from 'next-auth/react'
import useSWRMutation, {
  MutationFetcher,
  SWRMutationConfiguration
} from 'swr/mutation'

import { createProduct } from '@/lib/bruno'
import { CreateProductInput, Product, ProductConnection } from '@/models'

type Data = Product
type Error = any
type Key = { name: string; nextToken?: string; accessToken?: string }
type ExtraArg = { input: CreateProductInput }
type SWRData = ProductConnection

const fetcher: MutationFetcher<Data, Key, ExtraArg> = async (key, { arg }) => {
  return createProduct(arg.input, key.accessToken)
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

export default function useCreateProduct() {
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
