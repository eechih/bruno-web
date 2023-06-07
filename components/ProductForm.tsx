'use client'

import moment from 'moment'
import Link from 'next/link'
import { FormProvider, useForm } from 'react-hook-form'

import CreateProductButton from '@/components/CreateProductButton'
import ImageUploader from '@/components/ImageUploader'
import UpdateProductButton from '@/components/UpdateProductButton'
import { ErrorMessage, Input, Select } from '@/components/forms'
import {
  Button,
  Unstable_Grid2 as Grid,
  Stack,
  Typography
} from '@/components/mui/material'
import { providers } from '@/lib/constants'
import { Product } from '@/models'

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

const defaultValues: ProductFormInputs = {
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

export type ProductFormProps = {
  initialValues?: ProductFormInputs
}

export default function ProductForm({ initialValues }: ProductFormProps) {
  const methods = useForm<ProductFormInputs>({
    defaultValues: initialValues ?? defaultValues
  })
  const { control, formState } = methods
  const productId = initialValues?.id

  return (
    <FormProvider {...methods}>
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
              autoFocus={!initialValues}
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
            <ImageUploader
              acceptedFileTypes={['image/*']}
              accessLevel="public"
            />
          </Stack>
        </Grid>

        <Grid xs={12}>
          <Stack direction="row" justifyContent="end" spacing={2}>
            <Link
              href={productId ? `/products#${productId}` : '/products'}
              scroll={false}
            >
              <Button variant="outlined" color="inherit">
                取消
              </Button>
            </Link>
            {(productId && <UpdateProductButton productId={productId} />) || (
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

export function convertToInputs(product: Product): ProductFormInputs {
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
