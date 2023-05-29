import { NextRequest, NextResponse } from 'next/server'

import { createProduct, deleteProduct, updateProduct } from '@/lib/bruno'
import { isApiError } from '@/lib/type-guards'

function formatErrorMessage(err: Error): string {
  return JSON.stringify(err, Object.getOwnPropertyNames(err))
}

export async function POST(req: NextRequest): Promise<Response> {
  const input = await req.json()

  try {
    const product = await createProduct(input)
    return NextResponse.json({ status: 200, data: product })
  } catch (e) {
    if (isApiError(e)) {
      return NextResponse.json(
        { message: formatErrorMessage(e.message) },
        { status: e.status }
      )
    }

    return NextResponse.json({ error: JSON.stringify(e) }, { status: 500 })
  }
}

export async function PUT(req: NextRequest): Promise<Response> {
  const input = await req.json()
  try {
    const product = await updateProduct(input)
    return NextResponse.json({ status: 200, data: product })
  } catch (e) {
    if (isApiError(e)) {
      return NextResponse.json(
        { message: formatErrorMessage(e.message) },
        { status: e.status }
      )
    }

    return NextResponse.json(e, { status: 500 })
  }
}

export async function DELETE(req: NextRequest): Promise<Response> {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json(
      { error: 'Missing id of product' },
      { status: 400 }
    )
  }

  try {
    const product = await deleteProduct({ id })
    return NextResponse.json({ status: 200, data: product })
  } catch (e) {
    if (isApiError(e)) {
      return NextResponse.json(
        { message: formatErrorMessage(e.message) },
        { status: e.status }
      )
    }

    return NextResponse.json(e, { status: 500 })
  }
}
