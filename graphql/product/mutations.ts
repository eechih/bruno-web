export const createProductMutation = /* GraphQL */ `
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
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

export const updateProductMutation = /* GraphQL */ `
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
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

export const deleteProductMutation = /* GraphQL */ `
  mutation DeleteProduct($input: DeleteProductInput!) {
    deleteProduct(input: $input) {
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

export const asyncPublishProductMutation = /* GraphQL */ `
  mutation AsyncPublishProduct($input: AsyncPublishProductInput!) {
    asyncPublishProduct(input: $input) {
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
