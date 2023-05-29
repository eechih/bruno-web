import {
  createProductMutation,
  updateProductMutation
} from '@/lib/bruno/mutations/product'
import { getProductQuery, listProductsQuery } from '@/lib/bruno/queries/product'
import {
  CreateProductInput,
  CreateProductOperation,
  GetProductOperation,
  ListProductsOperation,
  Product,
  UpdateProductInput,
  UpdateProductOperation
} from '@/lib/bruno/types'
import { isApiError } from '@/lib/type-guards'

const endpoint = process.env.AWS_APPSYNC_GRAPHQL_ENDPOINT!
const key = process.env.AWS_APPSYNC_APIKEY!

type ExtractVariables<T> = T extends { variables: object }
  ? T['variables']
  : never

export async function brunoFetch<T>({
  query,
  variables,
  headers,
  cache = 'force-cache'
}: {
  query: string
  variables?: ExtractVariables<T>
  headers?: HeadersInit
  cache?: RequestCache
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': key,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache,
      next: { revalidate: 900 } // 15 minutes
    })

    const body = await result.json()

    if (body.errors) {
      throw body.errors[0]
    }

    return {
      status: result.status,
      body
    }
  } catch (e) {
    if (isApiError(e)) {
      throw {
        status: e.status || 500,
        message: e.message,
        query
      }
    }

    throw {
      error: e,
      query
    }
  }
}

export async function listProducts(): Promise<Product[]> {
  const res = await brunoFetch<ListProductsOperation>({
    query: listProductsQuery
  })
  return res.body.data.listProducts ?? []
}

export async function getProduct(id: string): Promise<Product> {
  const res = await brunoFetch<GetProductOperation>({
    query: getProductQuery,
    variables: { id }
  })
  return res.body.data.getProduct
}

export async function createProduct(
  input: CreateProductInput
): Promise<Product> {
  const res = await brunoFetch<CreateProductOperation>({
    query: createProductMutation,
    variables: { input },
    cache: 'no-store'
  })
  return res.body.data.createProduct
}

export async function updateProduct(
  input: UpdateProductInput
): Promise<Product> {
  console.log('updateProduct', input)
  const res = await brunoFetch<UpdateProductOperation>({
    query: updateProductMutation,
    variables: { input },
    cache: 'no-store'
  })
  return res.body.data.updateProduct
}
