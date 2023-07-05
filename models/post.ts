export interface Post {
  fbPostId: string
  message?: string
  images: { src: string }[]
  createdAt: string
}
