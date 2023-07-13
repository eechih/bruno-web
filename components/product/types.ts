import { Product } from '@/models'

export interface ProductFormProps {
  product?: Product
}

export type ProductFormInputs = {
  id?: string
  name: string
  description: string
  price: string
  cost: string
  provider: string
  offShelfDate: string
  offShelfTime: string
  options: string
  images: { key: string }[]
  fbMessage: string
  fbGroupId: string
}
