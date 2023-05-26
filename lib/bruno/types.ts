export type Connection<T> = {
  items: Array<T>
}

export type Product = {
  id: string
  name: string
  price: number
  cost?: number
  provider?: string
  offShelfAt?: string
  description?: string
}

export type ListProductsQuery = {
  data: {
    listProducts: Array<Product>
  }
}

export type GetProductQuery = {
  data: {
    getProduct: Product
  }
  variables: {
    id: string
  }
}
