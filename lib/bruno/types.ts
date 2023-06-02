export type Connection<T> = {
  items: Array<T>
  nextToken?: string
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

export type DeleteProductInput = Pick<Product, 'id'>

export type ListProductsOperation = {
  data: {
    listProducts: Connection<Product>
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

export type DeleteProductOperation = {
  data: {
    deleteProduct: Product
  }
  variables: {
    input: DeleteProductInput
  }
}

export type Image = {
  src: string
}

export type Post = {
  fbPostId: string
  message?: string
  images: Array<Image>
  createdAt: string
}

export type ImportPostOperation = {
  data: {
    importPost: Post
  }
  variables: {
    fbPostUrl: string
    newBrowser?: boolean
  }
}
