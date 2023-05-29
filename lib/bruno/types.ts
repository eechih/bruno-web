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

export type CreateProductInput = Omit<Product, 'id'>

export type UpdateProductInput = Omit<Partial<Product>, 'id'> & {
  id: string
}

export type ListProductsOperation = {
  data: {
    listProducts: Array<Product>
  }
}

export type GetProductOperation = {
  data: {
    getProduct: Product
  }
  variables: {
    id: string
  }
}

export type CreateProductOperation = {
  data: {
    createProduct: Product
  }
  variables: {
    input: CreateProductInput
  }
}

export type UpdateProductOperation = {
  data: {
    updateProduct: Product
  }
  variables: {
    input: UpdateProductInput
  }
}
