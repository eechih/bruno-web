export const importPostQuery = /* GraphQL */ `
  query importPost($fbPostUrl: String!, $newBrowser: Boolean) {
    importPost(fbPostUrl: $fbPostUrl, newBrowser: $newBrowser) {
      fbPostId
      message
      images {
        src
      }
      createdAt
    }
  }
`
