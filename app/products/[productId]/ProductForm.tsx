'use client'

import moment from 'moment'
import Link from 'next/link'
import { FormProvider, useForm } from 'react-hook-form'

import { ErrorMessage, Input, Select } from '@/components/forms'
import {
  Button,
  Unstable_Grid2 as Grid,
  Stack,
  Typography
} from '@/components/mui/material'
import { SnackbarProvider } from '@/components/notistack'
import { Product } from '@/lib/bruno/types'
import { providers } from '@/lib/constants'
import CreateProductButton from './CreateProductButton'
import UpdateProductButton from './UpdateProductButton'

export type ProductFormInputs = {
  id?: string
  name: string
  price: string
  cost: string
  provider: string
  offShelfDate: string
  offShelfTime: string
  description: string
  option: string
  images: { key: string }[]
}

const initialInputs: ProductFormInputs = {
  name: '',
  price: '',
  cost: '',
  provider: 'CAT',
  offShelfDate: moment().utcOffset(8).format('yyyy-MM-DD'),
  offShelfTime: '20:00',
  option: '',
  description: '',
  images: []
}

function convertToInputs(product: Product): ProductFormInputs {
  const offShelfAt = moment(product.offShelfAt)
  const offShelfDate = offShelfAt.isValid()
    ? offShelfAt.format('yyyy-MM-DD')
    : ''
  const offShelfTime = offShelfAt.isValid() ? offShelfAt.format('HH:mm') : ''

  return {
    id: product.id,
    name: product.name,
    price: product.price?.toString() ?? '',
    cost: product.cost?.toString() ?? '',
    provider: product.provider ?? '',
    offShelfDate,
    offShelfTime,
    description: product.description ?? '',
    option: '',
    images: []
  }
}

export type ProductFormProps = { product?: Product }

export default function ProductForm({ product }: ProductFormProps) {
  const isCreation = !product

  const methods = useForm<ProductFormInputs>({
    defaultValues: isCreation ? initialInputs : convertToInputs(product)
  })
  const { control, formState } = methods

  return (
    <FormProvider {...methods}>
      <SnackbarProvider />
      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          <Stack spacing={2}>
            <Typography variant="h6">基本設定</Typography>
            <Input
              name="name"
              control={control}
              rules={{ required: '必須提供名稱' }}
              label="名稱"
              type="txt"
              required
              fullWidth
              autoFocus={isCreation}
            />
            <Input
              name="price"
              control={control}
              rules={{
                required: '必須提供售價',
                min: { value: 0, message: '售價不可小於零' }
              }}
              label="價格"
              type="number"
              required
              fullWidth
            />
            <Input
              name="option"
              control={control}
              label="規格"
              type="txt"
              fullWidth
              helperText="'範例：紅，黑，白 / XL，L，M'"
            />
            <Select
              name="provider"
              control={control}
              label="供應商"
              options={providers}
              fullWidth
            />
            <Input
              name="cost"
              control={control}
              rules={{
                min: { value: 0, message: '成本不可小於零' }
              }}
              label="成本"
              type="number"
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <Input
                name="offShelfDate"
                control={control}
                label="下架日期"
                type="date"
                fullWidth
              />
              <Input
                name="offShelfTime"
                control={control}
                label="下架時間"
                type="time"
                fullWidth
              />
            </Stack>
          </Stack>
        </Grid>

        <Grid xs={12} md={6}>
          <Stack spacing={2}>
            <Typography variant="h6">社群貼文內容</Typography>
            <Input
              name="description"
              type="txt"
              control={control}
              label="描述"
              fullWidth
              minRows={15}
              multiline
            />
          </Stack>
        </Grid>

        <Grid xs={12}>
          <Stack spacing={2}>
            <Typography variant="h6">產品圖片</Typography>
            {/* <ImageFieldArray control={control} /> */}
          </Stack>
        </Grid>

        <Grid xs={12}>
          <Stack direction="row" justifyContent="end" spacing={2}>
            <Link
              href={product ? `/products#${product.id}` : '/products'}
              scroll={false}
            >
              返回
            </Link>
            <Button
              variant="outlined"
              color="inherit"
              LinkComponent={Link}
              href={product ? `/products#${product.id}` : '/products'}
              disabled={formState.isSubmitting}
            >
              取消
            </Button>
            {product ? (
              <UpdateProductButton productId={product.id} />
            ) : (
              <CreateProductButton />
            )}
          </Stack>
        </Grid>
        <Grid xs={12}>
          {formState.errors.root && (
            <ErrorMessage error={formState.errors.root} />
          )}
        </Grid>
      </Grid>
    </FormProvider>
  )
}
