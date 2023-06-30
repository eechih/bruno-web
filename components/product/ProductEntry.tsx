import Link from 'next/link'

import BrokenImageIcon from '@mui/icons-material/BrokenImage'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import useGetProduct from '@/hooks/useGetProduct'
import { useScreen } from '@/hooks/useMediaQuery'
import useStorageURL from '@/hooks/useStorageURL'
import DeleteProductButton from './DeleteProductButton'

interface ProductImageProps {
  file: { key: string }
}
function ProductImage({ file: { key } }: ProductImageProps) {
  const { url, error, isLoading } = useStorageURL(key, 'private')
  if (isLoading) return <Skeleton variant="rectangular" height={180} />
  if (error)
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{
          width: '100%',
          height: 180,
          backgroundColor: '#ddd'
        }}
      >
        <BrokenImageIcon />
      </Stack>
    )
  return (
    <CardMedia component="img" alt="green iguana" height="180" image={url} />
  )
}

function DefaultImage() {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{
        width: '100%',
        height: 180,
        backgroundColor: '#ddd'
      }}
    >
      <BrokenImageIcon />
    </Stack>
  )
}

export default function ProductEntry({ id }: { id: string }) {
  const { product, productLoading } = useGetProduct(id)
  const { isMobile } = useScreen()
  const thumbnail = product?.images?.[0] && { key: product.images[0] }

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
        <Card id={product.id} sx={{ borderRadius: isMobile ? 0 : 1 }}>
          {(thumbnail && <ProductImage file={thumbnail} />) || <DefaultImage />}
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
