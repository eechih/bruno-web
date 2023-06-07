import useSWRMutation, {
  MutationFetcher,
  SWRMutationConfiguration
} from 'swr/mutation'

import { deleteProduct } from '@/lib/bruno'
import { DeleteProductInput, Product, ProductConnection } from '@/models'

type Data = Product
type Error = any
type Key = string[]
type ExtraArg = { input: DeleteProductInput }
type SWRData = ProductConnection

const fetcher: MutationFetcher<Data, ExtraArg, Key> = async (key, { arg }) => {
  return deleteProduct(arg.input)
}

const options: SWRMutationConfiguration<Data, Error, ExtraArg, Key, SWRData> = {
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

export default function useCreateProduct() {
  const key = ['products']
  const { trigger, isMutating } = useSWRMutation(key, fetcher, options)
  return {
    deleteProduct: trigger,
    isDeleting: isMutating
  }
}
