import { getProductQuery, listProductsQuery } from '@/lib/bruno/queries/product'
import { GetProductQuery, ListProductsQuery, Product } from '@/lib/bruno/types'
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
  const res = await brunoFetch<ListProductsQuery>({
    query: listProductsQuery
  })
  return res.body.data.listProducts ?? []
}

export async function getProduct(id: string): Promise<Product> {
  const res = await brunoFetch<GetProductQuery>({
    query: getProductQuery,
    variables: { id }
  })
  return res.body.data.getProduct
}
