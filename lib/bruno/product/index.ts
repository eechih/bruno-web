import { graphql } from '../bruno-api'
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
  const res = await graphql<ListProductsOperation>({
    query: listProductsQuery,
    variables: { limit, nextToken }
  })
  return res.data.listProducts
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
  const res = await graphql<GetProductOperation>({
    query: getProductQuery,
    variables: { id }
  })
  return res.data.getProduct
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
  const res = await graphql<CreateProductOperation>({
    query: createProductMutation,
    variables: { input }
  })
  return res.data.createProduct
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
  const res = await graphql<UpdateProductOperation>({
    query: updateProductMutation,
    variables: { input }
  })
  return res.data.updateProduct
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
  const res = await graphql<DeleteProductOperation>({
    query: deleteProductMutation,
    variables: { input }
  })
  return res.data.deleteProduct
}
