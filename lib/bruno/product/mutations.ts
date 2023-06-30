export const createProductMutation = /* GraphQL */ `
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
      price
      cost
      images
      provider
      offShelfAt
    }
  }
`

export const updateProductMutation = /* GraphQL */ `
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      id
      name
      description
      price
      cost
      images
      provider
      offShelfAt
    }
  }
`

export const deleteProductMutation = /* GraphQL */ `
  mutation DeleteProduct($input: DeleteProductInput!) {
    deleteProduct(input: $input) {
      id
      name
      description
      price
      cost
      images
      provider
      offShelfAt
    }
  }
`

export const publishProductMutation = /* GraphQL */ `
  mutation PublishProduct($input: PublishProductInput!) {
    publishProduct(input: $input) {
      id
      name
      description
      price
      cost
      images
      provider
      offShelfAt
    }
  }
`
