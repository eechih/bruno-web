import { useSession } from 'next-auth/react'
import useSWRMutation, {
  MutationFetcher,
  SWRMutationConfiguration
} from 'swr/mutation'

import { updateProduct } from '@/lib/bruno'
import { Product, UpdateProductInput } from '@/models'

type Data = Product
type Error = any
type ExtraArg = { input: UpdateProductInput }
type Key = {
  name: string
  productId: string
  accessToken?: string
}
type SWRData = Product

const fetcher: MutationFetcher<Data, ExtraArg, Key> = async (key, options) => {
  return updateProduct(options.arg.input, key.accessToken)
}

const options: SWRMutationConfiguration<Data, Error, ExtraArg, Key, SWRData> = {
  populateCache: (updated, cached) => {
    if (cached) return { ...cached, ...updated }
    return updated
  },
  revalidate: false
}

export default function useUpdateProduct(id: string) {
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
