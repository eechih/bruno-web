'use client'

import { Product } from '@/models'
import DeleteIcon from '@mui/icons-material/Delete'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import moment from 'moment'
import NextImage from 'next/image'
import Link from 'next/link'
import { FormEvent, useEffect } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'

import awsExports from '@/aws-exports'
import CreateProductButton from '@/components/CreateProductButton'
import UpdateProductButton from '@/components/UpdateProductButton'
import { ErrorMessage, Input, Select } from '@/components/forms'
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
  images: { key: string; preview?: string; src?: string }[]
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
  const { control, formState, watch } = methods
  const productId = initialValues?.id
  const watchAllFields = watch()

  const {
    fields: images,
    append: appendImage,
    remove: removeImage,
    update: updateImage
  } = useFieldArray({
    control,
    name: 'images'
  })

  useEffect(() => {
    images.forEach(async (image, index) => {
      const { key, preview, src } = image
      if (!preview && !src) {
        Storage.get(key, {
          level: 'private'
        }).then(url => {
          updateImage(index, { ...image, src: url })
        })
      }
    })
  }, [images, updateImage])

  const handleFileUpload = (event: FormEvent<HTMLInputElement>) => {
    const { files } = event.target as HTMLInputElement
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader()

        console.log('file', file)
        reader.onloadend = () => {
          const imageBase64 = reader.result as string
          appendImage({ key: file.name, preview: imageBase64 })
        }

        reader.readAsDataURL(file)
      })
    }
  }

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
            <ImageList sx={{ width: 600 }} cols={3} rowHeight={200}>
              {images &&
                images.map((image, index) => {
                  return (
                    <ImageListItem key={index}>
                      <NextImage
                        src={image.src || image.preview || ''}
                        alt="photo"
                        fill
                        priority
                        style={{ objectFit: 'contain' }}
                      />
                      <ImageListItemBar
                        sx={{
                          background:
                            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
                        }}
                        position="top"
                        actionIcon={
                          <IconButton
                            sx={{ color: 'white' }}
                            aria-label={`delete ${image.key}`}
                            onClick={() => removeImage(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                        actionPosition="right"
                      />
                    </ImageListItem>
                  )
                })}
              <ImageListItem>
                <Button
                  color="inherit"
                  component="label"
                  size="large"
                  startIcon={<PhotoCameraIcon />}
                  sx={{
                    border: '1px dashed grey',
                    borderRadius: 0,
                    height: 200,
                    width: 200
                  }}
                >
                  上傳圖片
                  <input
                    hidden
                    accept="image/*"
                    multiple
                    type="file"
                    onChange={handleFileUpload}
                  />
                </Button>
              </ImageListItem>
            </ImageList>
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
        <pre>{JSON.stringify(watchAllFields, null, 2)}</pre>
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
