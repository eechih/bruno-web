/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getProduct = /* GraphQL */ `
  query GetProduct($id: ID!) {
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
`;
export const listProducts = /* GraphQL */ `
  query ListProducts(
    $filter: FilterProductInput
    $limit: Int
    $nextToken: String
  ) {
    listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
