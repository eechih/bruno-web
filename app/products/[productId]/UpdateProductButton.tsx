'use client'

import { useRouter } from 'next/navigation'
import { startTransition } from 'react'
import { SubmitHandler, useFormContext } from 'react-hook-form'

import { LoadingButton } from '@/components/mui/lab'
import { enqueueSnackbar } from '@/components/notistack'
import { UpdateProductInput } from '@/lib/bruno/types'
import { toOffShelfAt } from '../utils'
import { ProductFormInputs } from './ProductForm'

export default function UpdateProductButton({
  productId
}: {
  productId: string
}) {
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

      const res = await fetch(`/api/products`, {
        method: 'PUT',
        body: JSON.stringify(input)
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw Error(error.message)
      }
      await fetch(`/api/revalidate?path=/products/[productId]`)
      await fetch(`/api/revalidate?path=/products`)
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
    <LoadingButton
      variant="contained"
      color="primary"
      onClick={handleSubmit(onSubmit)}
      disabled={!formState.isDirty || !formState.isValid}
      loading={formState.isSubmitting}
    >
      儲存變更
    </LoadingButton>
  )
}