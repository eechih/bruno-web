import useSWRMutation, {
  MutationFetcher,
  SWRMutationConfiguration
} from 'swr/mutation'

import { createProduct } from '@/lib/bruno'
import { CreateProductInput, Product, ProductConnection } from '@/models'

type Data = Product
type Error = any
type Key = string[]
type ExtraArg = { input: CreateProductInput }
type SWRData = ProductConnection

const fetcher: MutationFetcher<Data, ExtraArg, Key> = async (key, { arg }) => {
  return createProduct(arg.input)
}

const options: SWRMutationConfiguration<Data, Error, ExtraArg, Key, SWRData> = {
  populateCache: (created, cached) => {
    if (cached) {
      return { ...cached, items: [created, ...cached.items] }
    }
    return { items: [created] }
  },
  revalidate: false
}

export default function useCreateProduct() {
  const key = ['products']
  const { trigger, isMutating } = useSWRMutation(key, fetcher, options)
  return {
    createProduct: trigger,
    isMutating
  }
}
