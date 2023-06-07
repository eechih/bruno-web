import useSWRMutation, {
  MutationFetcher,
  SWRMutationConfiguration
} from 'swr/mutation'

import { updateProduct } from '@/lib/bruno'
import { Product, UpdateProductInput } from '@/models'

type Data = Product
type Error = any
type ExtraArg = { input: UpdateProductInput }
type Key = string[]
type SWRData = Product

const fetcher: MutationFetcher<Data, ExtraArg, Key> = async (key, options) => {
  return updateProduct(options.arg.input)
}

const options: SWRMutationConfiguration<Data, Error, ExtraArg, Key, SWRData> = {
  populateCache: (updated, cached) => {
    if (cached) return { ...cached, ...updated }
    return updated
  },
  revalidate: false
}

export default function useUpdateProduct(id: string) {
  const key = ['product', id]
  const { trigger, isMutating } = useSWRMutation(key, fetcher, options)
  return {
    updateProduct: trigger,
    isMutating
  }
}
