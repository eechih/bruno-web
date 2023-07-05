export interface Product {
  id: string
  name: string
  description?: string
  price: number
  cost?: number
  optionGrid?: string[]
  images?: string[]
  provider?: string
  offShelfAt?: string
  publishAt?: string
  createdAt?: string
  updatedAt?: string
  owner?: string
}

export interface ProductConnection {
  items: Array<Pick<Product, 'id'>>
  scannedCount?: number
  nextToken?: string
}

export type CreateProductInput = Omit<Product, 'id'>
export type UpdateProductInput = Partial<Product> & Pick<Product, 'id'>
export type DeleteProductInput = Pick<Product, 'id'>
export type PublishProductInput = Pick<Product, 'id'>

export type ListProductsResultData = {
  listProducts: ProductConnection
}
export type GetProductResultData = {
  getProduct: Product
}
export type CreateProductResultData = {
  createProduct: Product
}
export type UpdateProductResultData = {
  updateProduct: Product
}
export type DeleteProductResultData = {
  deleteProduct: Product
}
