import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Unstable_Grid2 as Grid,
  Typography
} from '@/components/mui/material'
import { SnackbarProvider } from '@/components/notistack'
import { listProducts } from '@/lib/bruno'
import DeleteProductButton from './DeleteProductButton'

export default async function Page() {
  const products = await listProducts()

  // No products? Bail...
  if (!products) {
    notFound()
  }
  return (
    <Box>
      <SnackbarProvider />
      <Button LinkComponent={Link} href="/products/create">
        Create Product
      </Button>
      <Grid container spacing={2}>
        {products.map(product => {
          return (
            <Grid key={product.id} xs={12} sm={6} md={4} lg={3} xl={3}>
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="pre"
                  >
                    {JSON.stringify(product, null, 2)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <DeleteProductButton id={product.id} />
                  <Button
                    size="small"
                    LinkComponent={Link}
                    href={`/products/${product.id}`}
                  >
                    編輯
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}
