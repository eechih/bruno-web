export interface ProductConnection {
  items: { id: string }[]
  nextToken?: string
}

export interface Product {
  id: string
  name: string
  price: number
  cost?: number
  provider?: string
  offShelfAt?: string
  description?: string
}

export type CreateProductInput = Omit<Product, 'id'>

export type UpdateProductInput = Partial<Product> & Pick<Product, 'id'>

export type DeleteProductInput = Pick<Product, 'id'>
