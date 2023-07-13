'use client'

import { Product } from '@/models'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import moment from 'moment'
import Link from 'next/link'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'

import { StorageImageList } from '@/components/StorageImageList'
import { StorageManager } from '@/components/StorageManager'
import { ErrorMessage, Input, Select } from '@/components/forms'
import { useScreen } from '@/hooks/useMediaQuery'
import { providers } from '@/lib/constants'
import CreateProductButton from './CreateProductButton'
import UpdateProductButton from './UpdateProductButton'
import { ProductFormInputs, ProductFormProps } from './types'
import { convertToFormInputs, getDefaultFormInputs } from './utils'

export default function ProductForm({ product }: ProductFormProps) {
  const methods = useForm<ProductFormInputs>({
    defaultValues: product
      ? convertToFormInputs(product)
      : getDefaultFormInputs()
  })

  const { control, formState, watch } = methods
  const { dirtyFields } = formState
  const productId = product?.id
  const watchAllFields = watch()
  const { isMobile, screenWidth } = useScreen()
  const variant = 'outlined'
  const storageImageListWidth = screenWidth - 64

  const {
    fields: images,
    append: appendImage,
    remove: removeImage
  } = useFieldArray({
    control,
    name: 'images'
  })

  const handleImageAppend = (params: { key?: string }) => {
    if (params.key) {
      const found = images.find(image => image.key == params.key)
      if (!found) appendImage({ key: params.key })
    }
  }

  const handleImageReomve = (params: { key: string }) => {
    const index = images.findIndex(image => image.key == params.key)
    if (index > -1) removeImage(index)
  }

  return (
    <FormProvider {...methods}>
      <Grid container spacing={isMobile ? 2 : 2}>
        <Grid xs={12} md={6}>
          <Stack spacing={2} component={Paper} sx={{ padding: 2 }}>
            <Typography variant="h6">基本設定</Typography>
            <Input
              name="name"
              control={control}
              rules={{ required: '必須提供名稱' }}
              label="名稱"
              type="txt"
              required
              fullWidth
              variant={variant}
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
              variant={variant}
            />
            <Input
              name="options"
              control={control}
              label="規格"
              type="txt"
              fullWidth
              helperText="'範例：紅，黑，白 / XL，L，M'"
              variant={variant}
            />
            <Select
              name="provider"
              control={control}
              label="供應商"
              options={providers}
              fullWidth
              variant={variant}
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
              variant={variant}
            />
            <Stack direction="row" spacing={2}>
              <Input
                name="offShelfDate"
                control={control}
                label="下架日期"
                type="date"
                fullWidth
                variant={variant}
              />
              <Input
                name="offShelfTime"
                control={control}
                label="下架時間"
                type="time"
                fullWidth
                variant={variant}
              />
            </Stack>
          </Stack>
        </Grid>

        <Grid xs={12} md={6}>
          <Stack spacing={2} component={Paper} sx={{ padding: 2 }}>
            <Typography variant="h6">社群貼文內容</Typography>
            <Input
              name="fbMessage"
              type="txt"
              control={control}
              label="貼文內容"
              fullWidth
              minRows={15}
              multiline
              variant={variant}
            />
            <Select
              name="fbGroupId"
              control={control}
              label="要貼文之社團"
              options={[
                {
                  value: '913862951959460',
                  label: 'Sophia 愛分享'
                },
                {
                  value: '384011198690249',
                  label: '【團媽蘇菲亞】 揪團 批發社'
                }
              ]}
              fullWidth
              variant={variant}
            />
          </Stack>
        </Grid>
        <Grid xs={12}>
          <Stack spacing={0} component={Paper} sx={{ padding: 2 }}>
            <Typography variant="h6">產品列表</Typography>
            <StorageManager
              accessLevel="private"
              maxFileCount={10}
              onUploadSuccess={handleImageAppend}
              onFileRemove={handleImageReomve}
              dialogProps={{ fullScreen: isMobile }}
            />
            <StorageImageList
              accessLevel="private"
              files={images}
              onFileRemove={handleImageReomve}
              width={isMobile ? storageImageListWidth : 600}
              cols={isMobile ? 2 : 3}
              rowHeight={isMobile ? (storageImageListWidth / 2) * 0.67 : 133}
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
        {false && <pre>{JSON.stringify(watchAllFields, null, 2)}</pre>}
        {false && <pre>{JSON.stringify(dirtyFields, null, 2)}</pre>}
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
  const images = product.images
    ? product.images.map(image => {
        return { key: image }
      })
    : []

  return {
    id: product.id,
    name: product.name,
    description: product.description ?? '',
    price: product.price?.toString() ?? '',
    cost: product.cost?.toString() ?? '',
    provider: product.provider ?? '',
    offShelfDate,
    offShelfTime,
    options: product.options?.toString() ?? '',
    images: images,
    fbMessage: product.fbMessage ?? '',
    fbGroupId: product.fbGroupId ?? ''
  }
}
