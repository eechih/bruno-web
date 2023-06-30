'use client'

import { Product } from '@/models'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import moment from 'moment'
import Link from 'next/link'
import {
  DefaultValues,
  FormProvider,
  useFieldArray,
  useForm
} from 'react-hook-form'

import awsExports from '@/aws-exports'
import CreateProductButton from '@/components/CreateProductButton'
import { StorageImageList } from '@/components/StorageImageList'
import { StorageManager } from '@/components/StorageManager'
import UpdateProductButton from '@/components/UpdateProductButton'
import { ErrorMessage, Input, Select } from '@/components/forms'
import { useScreen } from '@/hooks/useMediaQuery'
import { Storage } from '@/lib/aws'
import { providers } from '@/lib/constants'

Storage.configure(awsExports)

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

const defaultValues: DefaultValues<ProductFormInputs> = {
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
  initialValues?: DefaultValues<ProductFormInputs>
}

export default function ProductForm({ initialValues }: ProductFormProps) {
  const methods = useForm<ProductFormInputs>({
    defaultValues: initialValues ?? defaultValues
  })
  const { control, formState, watch } = methods
  const { dirtyFields } = formState
  const productId = initialValues?.id
  const watchAllFields = watch()
  const { isMobile, screenWidth } = useScreen()
  const variant = isMobile ? 'filled' : 'outlined'

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
      <Grid container spacing={isMobile ? 0 : 2}>
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
              name="option"
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
              variant={variant}
            />
          </Stack>
        </Grid>
        <Grid xs={12}>
          <Stack spacing={0}>
            <Typography variant="h6">產品圖片{screenWidth}</Typography>
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
              width={isMobile ? screenWidth : 600}
              cols={isMobile ? 2 : 3}
              rowHeight={isMobile ? (screenWidth / 2) * 0.67 : 133}
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
        {!isMobile && <pre>{JSON.stringify(watchAllFields, null, 2)}</pre>}
        <pre>{JSON.stringify(dirtyFields, null, 2)}</pre>
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
    price: product.price?.toString() ?? '',
    cost: product.cost?.toString() ?? '',
    provider: product.provider ?? '',
    offShelfDate,
    offShelfTime,
    description: product.description ?? '',
    option: '',
    images: images
  }
}
