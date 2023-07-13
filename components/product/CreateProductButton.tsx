'use client'

import LoadingButton from '@mui/lab/LoadingButton'
import { useRouter } from 'next/navigation'
import { startTransition } from 'react'
import { SubmitHandler, useFormContext } from 'react-hook-form'

import { useCreateProduct } from '@/hooks/useDataOperation'
import { toOffShelfAt } from '@/lib/utils'
import { CreateProductInput } from '@/models'
import { ProductFormInputs } from './types'
import { parseOptions } from './utils'

type CreateProductButtonProps = {
  onSuccess?: () => void
}

export default function CreateProductButton(props: CreateProductButtonProps) {
  const { createProduct } = useCreateProduct()
  const { handleSubmit, reset, formState, setError } =
    useFormContext<ProductFormInputs>()
  const router = useRouter()

  const onSubmit: SubmitHandler<ProductFormInputs> = async data => {
    try {
      const input: CreateProductInput = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        cost: Number(data.cost),
        options: parseOptions(data.options),
        images: data.images.map(image => image.key),
        provider: data.provider,
        offShelfAt: toOffShelfAt(data.offShelfDate, data.offShelfTime),
        fbMessage: data.fbMessage,
        fbGroupId: data.fbGroupId
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
