'use client'

import LoadingButton from '@mui/lab/LoadingButton'
import { useRouter } from 'next/navigation'
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import { startTransition } from 'react'
import { SubmitHandler, useFormContext } from 'react-hook-form'

import useUpdateProduct from '@/hooks/useUpdateProduct'
import { toOffShelfAt } from '@/lib/utils'
import { UpdateProductInput } from '@/models'
import { ProductFormInputs } from './ProductForm'

type UpdateProductButtonProps = {
  productId: string
}

export default function UpdateProductButton({
  productId
}: UpdateProductButtonProps) {
  const { updateProduct } = useUpdateProduct(productId)

  const { handleSubmit, reset, formState, setError } =
    useFormContext<ProductFormInputs>()
  const router = useRouter()

  const onSubmit: SubmitHandler<ProductFormInputs> = async data => {
    try {
      const { dirtyFields } = formState
      const input: UpdateProductInput = { id: productId }
      if (dirtyFields.name) input.name = data.name
      if (dirtyFields.price) input.price = Number(data.price)
      if (dirtyFields.cost) input.cost = Number(data.cost)
      if (dirtyFields.description) input.description = data.description
      if (dirtyFields.provider) input.provider = data.provider
      if (dirtyFields.offShelfDate || dirtyFields.offShelfTime)
        input.offShelfAt = toOffShelfAt(data.offShelfDate, data.offShelfTime)

      await updateProduct({ input })
      enqueueSnackbar('儲存成功', {
        variant: 'success',
        autoHideDuration: 2000
      })
      startTransition(() => {
        router.refresh()
      })
      reset(data)
    } catch (error) {
      const { message } = error as Error
      setError('root.serverError', {
        type: 'server',
        message: message
      })
    }
  }

  return (
    <>
      <SnackbarProvider />
      <LoadingButton
        variant="contained"
        color="primary"
        onClick={handleSubmit(onSubmit)}
        disabled={!formState.isDirty || !formState.isValid}
        loading={formState.isSubmitting}
      >
        儲存變更
      </LoadingButton>
    </>
  )
}