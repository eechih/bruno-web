'use client'

import LoadingButton from '@mui/lab/LoadingButton'
import { useRouter } from 'next/navigation'
import { startTransition } from 'react'
import { SubmitHandler, useFormContext } from 'react-hook-form'

import useCreateProduct from '@/hooks/useCreateProduct'
import { toOffShelfAt } from '@/lib/utils'
import { CreateProductInput } from '@/models'
import { ProductFormInputs } from './ProductForm'

type CreateProductButtonProps = {
  onSuccess?: () => void
}

export default function CreateProductButton(props: CreateProductButtonProps) {
  const { createProduct } = useCreateProduct()
  const { handleSubmit, reset, formState, setError } =
    useFormContext<ProductFormInputs>()
  const router = useRouter()

  const onSubmit: SubmitHandler<ProductFormInputs> = async data => {
    // const images = await Promise.all(
    //   data.images.map(async image => {
    //     const { key, preview } = image
    //     if (preview) {
    //       const imageBuffer = Buffer.from(preview.split(',')[1], 'base64')
    //       await Storage.put(image.key, imageBuffer, {
    //         level: 'private'
    //       })
    //       return key
    //     }
    //     return ''
    //   })
    // )
    const images: string[] = []
    console.log('images', images)

    try {
      const input: CreateProductInput = {
        name: data.name,
        price: Number(data.price),
        cost: Number(data.cost),
        description: data.description,
        images: images,
        provider: data.provider,
        offShelfAt: toOffShelfAt(data.offShelfDate, data.offShelfTime)
      }
      await createProduct({ input })
      reset(data)
      alert('新增成功')
      props.onSuccess && props.onSuccess()
      startTransition(() => {
        router.push('/products')
      })
    } catch (error) {
      const { message } = error as Error
      setError('root.serverError', {
        type: 'server',
        message: message
      })
    }
  }

  return (
    <LoadingButton
      variant="contained"
      color="primary"
      onClick={handleSubmit(onSubmit)}
      disabled={!formState.isDirty || !formState.isValid}
      loading={formState.isSubmitting}
    >
      建立產品
    </LoadingButton>
  )
}
