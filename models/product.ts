/* eslint-disable no-unused-vars */

export type ISO8601String = string

export enum ProductPublishState {
  PENDING = 'pending',
  PPRCESSING = 'processing',
  PPRCESSED = 'processed',
  FAILED = 'failed'
}

export interface Product {
  id: string // 商品ID
  name: string // 商品名稱
  description?: string // 商品描述
  price: number // 價格
  cost?: number // 成本
  options?: string[][] // 規格
  images?: string[] // 圖片 URLs
  provider?: string // 產地 (進貨廠商)
  offShelfAt?: ISO8601String // 自動下架時間
  fbMessage?: string // 社群貼文內容
  fbGroupId?: string // 要貼文之社團
  fbPostId?: string // FB貼文ID
  fbPostedAt?: ISO8601String // FB貼文時間
  bp1ProductId?: string // Buy+1 ID
  bp1CreatedAt?: ISO8601String // Buy+1產品編號
  publishState?: ProductPublishState // 發佈的處理狀態
  createdAt?: ISO8601String
  updatedAt?: ISO8601String
  owner: string
}

export interface ProductConnection {
  items: Array<Pick<Product, 'id'>>
  scannedCount?: number
  nextToken?: string
}

export type CreateProductInput = Pick<
  Product,
  | 'name'
  | 'description'
  | 'price'
  | 'cost'
  | 'options'
  | 'images'
  | 'provider'
  | 'offShelfAt'
  | 'fbMessage'
  | 'fbGroupId'
>
export type UpdateProductInput = Pick<Product, 'id'> &
  Partial<
    Pick<
      Product,
      | 'name'
      | 'description'
      | 'price'
      | 'cost'
      | 'options'
      | 'images'
      | 'provider'
      | 'offShelfAt'
      | 'fbMessage'
      | 'fbGroupId'
    >
  >
export type DeleteProductInput = Pick<Product, 'id'>
export type AsyncPublishProductInput = Pick<Product, 'id'>

export type ListProductsResultData = {
  listProducts: ProductConnection
}
export type GetProductResultData = {
  getProduct: Product
}
export type CreateProductResultData = {
  createProduct: Product
}
export type UpdateProductResultData = {
  updateProduct: Product
}
export type DeleteProductResultData = {
  deleteProduct: Product
}
