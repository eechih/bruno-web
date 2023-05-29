'use client'

import { useRouter } from 'next/navigation'
import { SnackbarProvider } from 'notistack'
import { startTransition } from 'react'
import { SubmitHandler, useFormContext } from 'react-hook-form'

import { LoadingButton } from '@/components/mui/lab'
import { CreateProductInput } from '@/lib/bruno/types'
import { toOffShelfAt } from '../utils'
import { ProductFormInputs } from './ProductForm'

export default function CreateProductButton() {
  const { handleSubmit, reset, formState, setError } =
    useFormContext<ProductFormInputs>()
  const router = useRouter()

  const onSubmit: SubmitHandler<ProductFormInputs> = async data => {
    try {
      const input: CreateProductInput = {
        name: data.name,
        price: Number(data.price),
        cost: Number(data.cost),
        description: data.description,
        provider: data.provider,
        offShelfAt: toOffShelfAt(data.offShelfDate, data.offShelfTime)
      }
      const res = await fetch(`/api/products`, {
        method: 'POST',
        body: JSON.stringify(input)
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw Error(error.message)
      }
      await fetch(`/api/revalidate?path=/products`)
      reset(data)
      alert('新增成功')
      startTransition(() => {
        router.refresh()
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
    <>
      <SnackbarProvider />
      <LoadingButton
        variant="contained"
        color="primary"
        onClick={handleSubmit(onSubmit)}
        disabled={!formState.isDirty || !formState.isValid}
        loading={formState.isSubmitting}
      >
        建立產品
      </LoadingButton>
    </>
  )
}
