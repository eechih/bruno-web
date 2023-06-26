export const listProductsQuery = /* GraphQL */ `
  query listProducts {
    listProducts {
      items {
        id
      }
      nextToken
    }
  }
`

export const getProductQuery = /* GraphQL */ `
  query getProduct($id: ID!) {
    getProduct(id: $id) {
      id
      name
      price
      cost
      images
      provider
      offShelfAt
      description
    }
  }
`
