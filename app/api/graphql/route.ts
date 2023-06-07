import { NextRequest, NextResponse } from 'next/server'

const endpoint = process.env.AWS_APPSYNC_GRAPHQL_ENDPOINT!
const key = process.env.AWS_APPSYNC_APIKEY!

export async function POST(req: NextRequest): Promise<Response> {
  const payload = await req.json()
  const { query, variables } = payload

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': key
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache: 'no-cache'
    })

    const body = await result.json()

    if (body.errors) {
      throw body.errors[0]
    }

    return NextResponse.json(body)
  } catch (e) {
    throw {
      error: e,
      query
    }
  }
}
