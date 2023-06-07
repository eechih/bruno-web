type ExtractVariables<T> = T extends { variables: object }
  ? T['variables']
  : never

export default async function brunoFetch<T>({
  query,
  variables,
  headers,
  cache = 'no-cache'
}: {
  query: string
  variables?: ExtractVariables<T>
  headers?: HeadersInit
  cache?: RequestCache
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache
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
    throw {
      error: e,
      query
    }
  }
}
