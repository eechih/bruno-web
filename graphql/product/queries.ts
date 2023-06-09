export const listProductsQuery = /* GraphQL */ `
  query listProducts {
    listProducts {
      items {
        id
      }
      scannedCount
      nextToken
    }
  }
`

export const getProductQuery = /* GraphQL */ `
  query getProduct($id: ID!) {
    getProduct(id: $id) {
      id
      name
      description
      price
      cost
      options
      images
      provider
      offShelfAt
      fbMessage
      fbGroupId
      fbPostId
      fbPostedAt
      bp1ProductId
      bp1CreatedAt
      publishState
      createdAt
      updatedAt
      owner
    }
  }
`
