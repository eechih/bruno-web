/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createProduct = /* GraphQL */ `
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
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
`;
export const deleteProduct = /* GraphQL */ `
  mutation DeleteProduct($input: DeleteProductInput!) {
    deleteProduct(input: $input) {
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
`;
