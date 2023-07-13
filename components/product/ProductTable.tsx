import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import Link from 'next/link'

import { useGetProduct } from '@/hooks/useDataOperation'
import { Product } from '@/models'
import ProductThumbnail from './ProductThumbnail'

function ProductRow({ id }: { id: string }) {
  const { product, productLoading } = useGetProduct(id)
  if (product) {
    const { id, name, price, cost, provider, images, publishState } = product
    const thumbnail = images?.[0] && { key: images[0] }
    const offShelfAt = product.offShelfAt
      ? moment(product.offShelfAt)
      : undefined
    const createdAt = moment(product.createdAt)
    return (
      <TableRow hover role="checkbox" tabIndex={-1}>
        <TableCell>
          <Stack direction="row" spacing={2}>
            <Stack>{thumbnail && <ProductThumbnail file={thumbnail} />}</Stack>
            <Stack justifyContent="center" alignItems="flex-start">
              <Typography variant="subtitle2">{name}</Typography>
            </Stack>
          </Stack>
        </TableCell>
        <TableCell>{price}</TableCell>
        <TableCell>{provider}</TableCell>
        <TableCell>{cost}</TableCell>
        <TableCell>
          {offShelfAt && (
            <Stack justifyContent="center" alignItems="flex-start">
              <Typography variant="body1">
                {offShelfAt.format('yyyy/MM/DD')}
              </Typography>
              <Typography variant="body2">
                {offShelfAt.format('HH:mm')}
              </Typography>
            </Stack>
          )}
        </TableCell>
        <TableCell>{publishState}</TableCell>
        <TableCell>
          {createdAt && (
            <Stack justifyContent="center" alignItems="flex-start">
              <Typography variant="body1">
                {createdAt.format('yyyy/MM/DD')}
              </Typography>
              <Typography variant="body2">
                {createdAt.format('HH:mm')}
              </Typography>
            </Stack>
          )}
        </TableCell>
        <TableCell>
          <Stack direction="row">
            <Button size="small" LinkComponent={Link} href={`/products/${id}`}>
              編輯
            </Button>
            <Button onClick={() => {}}>發佈</Button>
          </Stack>
        </TableCell>
      </TableRow>
    )
  }
  return (
    <TableRow>
      <TableCell>
        <Checkbox color="primary" disabled />
      </TableCell>
      <TableCell>
        <Typography variant="body2">{id.substring(0, 8)}</Typography>
      </TableCell>
      <TableCell>{productLoading ? 'loading...' : 'no data'}</TableCell>
    </TableRow>
  )
}

export interface ProductTableProps {
  products?: Pick<Product, 'id'>[]
}

export default function ProductTable({ products }: ProductTableProps) {
  return (
    <Paper variant="outlined" sx={{ width: '100%', mb: 2, borderRadius: 4 }}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              <TableCell style={{ minWidth: 300 }}>產品</TableCell>
              <TableCell style={{ minWidth: 80 }}>售價</TableCell>
              <TableCell style={{ minWidth: 120 }}>廠商</TableCell>
              <TableCell style={{ minWidth: 80 }}>成本</TableCell>
              <TableCell style={{ minWidth: 100 }}>下架時間</TableCell>
              <TableCell style={{ minWidth: 120 }}>狀態</TableCell>
              <TableCell style={{ minWidth: 100 }}>建立於</TableCell>
              <TableCell style={{ minWidth: 80 }}></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products &&
              products.map(({ id }) => {
                return <ProductRow id={id} key={id} />
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={3}
        rowsPerPage={10}
        page={0}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
      />
    </Paper>
  )
}
