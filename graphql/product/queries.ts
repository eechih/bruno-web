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
      optionGrid
      images
      provider
      offShelfAt
      publishAt
      createdAt
      updatedAt
      owner
    }
  }
`
