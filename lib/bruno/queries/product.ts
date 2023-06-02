export const listProductsQuery = /* GraphQL */ `
  query listProducts {
    listProducts {
      items {
        id
        name
        price
        cost
        provider
        offShelfAt
        description
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
      provider
      offShelfAt
      description
    }
  }
`
