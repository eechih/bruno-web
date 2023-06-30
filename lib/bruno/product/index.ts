import { graphql } from '../bruno-api'
import * as mutations from './mutations'
import * as queries from './queries'
import {
  CreateProductInput,
  DeleteProductInput,
  Product,
  ProductConnection,
  PublishProductInput,
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
  nextToken?: string,
  authToken?: string
): Promise<ProductConnection> {
  console.log('listProducts', nextToken, authToken)
  const limit = 2
  const res = await graphql<ListProductsOperation>({
    query: queries.listProductsQuery,
    variables: { limit, nextToken },
    authToken: authToken
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

export async function getProduct(
  id: string,
  authToken?: string
): Promise<Product> {
  const res = await graphql<GetProductOperation>({
    query: queries.getProductQuery,
    variables: { id },
    authToken
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
  input: CreateProductInput,
  authToken?: string
): Promise<Product> {
  const res = await graphql<CreateProductOperation>({
    query: mutations.createProductMutation,
    variables: { input },
    authToken
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
  input: UpdateProductInput,
  authToken?: string
): Promise<Product> {
  const res = await graphql<UpdateProductOperation>({
    query: mutations.updateProductMutation,
    variables: { input },
    authToken
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
  input: DeleteProductInput,
  authToken?: string
): Promise<Product> {
  const res = await graphql<DeleteProductOperation>({
    query: mutations.deleteProductMutation,
    variables: { input },
    authToken
  })
  return res.data.deleteProduct
}

interface PublishProductOperation {
  variables: {
    input: PublishProductInput
  }
  data: {
    publishProduct: Product
  }
}

export async function publishProduct(
  input: PublishProductInput,
  authToken?: string
): Promise<Product> {
  const res = await graphql<PublishProductOperation>({
    query: mutations.publishProductMutation,
    variables: { input },
    authToken
  })
  return res.data.publishProduct
}
