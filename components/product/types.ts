import { Product } from '@/models'

export interface ProductFormProps {
  product?: Product
}

export type ProductFormInputs = {
  id?: string
  name: string
  price: string
  cost: string
  provider: string
  offShelfDate: string
  offShelfTime: string
  description: string
  option: string
  images: { key: string }[]
}
