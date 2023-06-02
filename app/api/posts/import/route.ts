import { NextRequest, NextResponse } from 'next/server'

import { importPost } from '@/lib/bruno'
import { isApiError } from '@/lib/type-guards'

function formatErrorMessage(err: Error): string {
  return JSON.stringify(err, Object.getOwnPropertyNames(err))
}

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const fbPostUrl = searchParams.get('fb_post_url') as string
  const newBrowser = searchParams.get('new_browser') === 'true'
  console.log('fbPostUrl', fbPostUrl)
  console.log('newBrowser', newBrowser)
  try {
    const post = await importPost(fbPostUrl, newBrowser)
    return NextResponse.json({ status: 200, data: post })
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
