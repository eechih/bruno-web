import brunoFetch from '../fetcher'
import {
  createProductMutation,
  deleteProductMutation,
  updateProductMutation
} from './mutations'
import { getProductQuery, listProductsQuery } from './queries'
import {
  CreateProductInput,
  DeleteProductInput,
  Product,
  ProductConnection,
  UpdateProductInput
} from './types'

interface ListProductsOperation {
  variables: {
    limit: number
    nextToken?: string
  }
  data: {
    listProducts: ProductConnection
  }
}
export async function listProducts(
  nextToken?: string
): Promise<ProductConnection> {
  const limit = 2
  const res = await brunoFetch<ListProductsOperation>({
    query: listProductsQuery,
    variables: { limit, nextToken }
  })
  return res.body.data.listProducts
}

interface GetProductOperation {
  variables: {
    id: string
  }
  data: {
    getProduct: Product
  }
}

export async function getProduct(id: string): Promise<Product> {
  const res = await brunoFetch<GetProductOperation>({
    query: getProductQuery,
    variables: { id }
  })
  return res.body.data.getProduct
}

interface CreateProductOperation {
  variables: {
    input: CreateProductInput
  }
  data: {
    createProduct: Product
  }
}

export async function createProduct(
  input: CreateProductInput
): Promise<Product> {
  const res = await brunoFetch<CreateProductOperation>({
    query: createProductMutation,
    variables: { input }
  })
  return res.body.data.createProduct
}

interface UpdateProductOperation {
  variables: {
    input: UpdateProductInput
  }
  data: {
    updateProduct: Product
  }
}

export async function updateProduct(
  input: UpdateProductInput
): Promise<Product> {
  const res = await brunoFetch<UpdateProductOperation>({
    query: updateProductMutation,
    variables: { input }
  })
  return res.body.data.updateProduct
}

interface DeleteProductOperation {
  variables: {
    input: DeleteProductInput
  }
  data: {
    deleteProduct: Product
  }
}

export async function deleteProduct(
  input: DeleteProductInput
): Promise<Product> {
  const res = await brunoFetch<DeleteProductOperation>({
    query: deleteProductMutation,
    variables: { input }
  })
  return res.body.data.deleteProduct
}
