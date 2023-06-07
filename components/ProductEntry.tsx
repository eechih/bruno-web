import Link from 'next/link'

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Skeleton,
  Stack,
  Typography
} from '@/components/mui/material'

import DeleteProductButton from '@/components/DeleteProductButton'
import useGetProduct from '@/hooks/useGetProduct'

export default function ProductEntry({ id }: { id: string }) {
  const { product, productLoading } = useGetProduct(id)

  return (
    <div>
      {productLoading && (
        <Stack spacing={1}>
          <Skeleton variant="rectangular" height={180} />
          <Skeleton variant="text" width={120} height={40} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="text" width={60} height={48} />
        </Stack>
      )}
      {product && (
        <Card id={product.id}>
          <CardMedia
            component="img"
            alt="green iguana"
            height="180"
            image="https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" component="pre">
              {JSON.stringify(product, null, 2)}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              LinkComponent={Link}
              href={`/products/${product.id}`}
            >
              編輯
            </Button>
            <DeleteProductButton id={product.id} />
          </CardActions>
        </Card>
      )}
    </div>
  )
}
