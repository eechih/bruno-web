/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateProductInput = {
  name: string,
  description?: string | null,
  price: number,
  cost?: number | null,
  optionGrid?: Array< string | null > | null,
  images?: Array< string | null > | null,
  provider?: string | null,
  offShelfAt?: string | null,
  publishAt?: string | null,
};

export type Product = {
  __typename: "Product",
  id: string,
  name?: string | null,
  description?: string | null,
  price?: number | null,
  cost?: number | null,
  optionGrid?: Array< string | null > | null,
  images?: Array< string | null > | null,
  provider?: string | null,
  offShelfAt?: string | null,
  publishAt?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  owner?: string | null,
};

export type DeleteProductInput = {
  id: string,
};

export type FilterProductInput = {
  id?: TableIDFilterInput | null,
  name?: TableStringFilterInput | null,
};

export type TableIDFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type TableStringFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type CreateProductMutationVariables = {
  input: CreateProductInput,
};

export type CreateProductMutation = {
  createProduct?:  {
    __typename: "Product",
    id: string,
    name?: string | null,
    description?: string | null,
    price?: number | null,
    cost?: number | null,
    optionGrid?: Array< string | null > | null,
    images?: Array< string | null > | null,
    provider?: string | null,
    offShelfAt?: string | null,
    publishAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type DeleteProductMutationVariables = {
  input: DeleteProductInput,
};

export type DeleteProductMutation = {
  deleteProduct?:  {
    __typename: "Product",
    id: string,
    name?: string | null,
    description?: string | null,
    price?: number | null,
    cost?: number | null,
    optionGrid?: Array< string | null > | null,
    images?: Array< string | null > | null,
    provider?: string | null,
    offShelfAt?: string | null,
    publishAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type GetProductQueryVariables = {
  id: string,
};

export type GetProductQuery = {
  getProduct?:  {
    __typename: "Product",
    id: string,
    name?: string | null,
    description?: string | null,
    price?: number | null,
    cost?: number | null,
    optionGrid?: Array< string | null > | null,
    images?: Array< string | null > | null,
    provider?: string | null,
    offShelfAt?: string | null,
    publishAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type ListProductsQueryVariables = {
  filter?: FilterProductInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProductsQuery = {
  listProducts?:  Array< {
    __typename: "Product",
    id: string,
    name?: string | null,
    description?: string | null,
    price?: number | null,
    cost?: number | null,
    optionGrid?: Array< string | null > | null,
    images?: Array< string | null > | null,
    provider?: string | null,
    offShelfAt?: string | null,
    publishAt?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null > | null,
};
