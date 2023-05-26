export const listProductsQuery = /* GraphQL */ `
  query listProducts {
    listProducts {
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
