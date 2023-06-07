import brunoFetch from '../fetcher'
import { importPostQuery } from './queries'
import { Post } from './types'

interface ImportPostOperation {
  variables: {
    fbPostUrl: string
    newBrowser?: boolean
  }
  data: {
    importPost: Post
  }
}
export async function importPost(
  fbPostUrl: string,
  newBrowser?: boolean
): Promise<Post> {
  const res = await brunoFetch<ImportPostOperation>({
    query: importPostQuery,
    variables: { fbPostUrl, newBrowser }
  })
  return res.body.data.importPost
}
