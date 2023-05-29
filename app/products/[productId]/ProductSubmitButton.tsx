'use client'

import moment from 'moment'
import { useRouter } from 'next/navigation'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { startTransition } from 'react'
import { SubmitHandler, useFormContext } from 'react-hook-form'

import { LoadingButton } from '@/components/mui/lab'
import { CreateProductInput, UpdateProductInput } from '@/lib/bruno/types'
import { ProductFormInputs } from './ProductForm'

export default function ProductSubmitButton() {
  const { handleSubmit, reset, formState, watch, setError } =
    useFormContext<ProductFormInputs>()
  const router = useRouter()
  const watchId = watch('id')

  const toOffShelfAt = (offShelfDate: string, offShelfTime: string) =>
    moment(offShelfDate + 'T' + offShelfTime).toISOString()

  const createProduct = async (data: ProductFormInputs) => {
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
  }

  const updateProduct = async (data: ProductFormInputs) => {
    if (!data.id) throw Error('Product ID is required.')
    const { dirtyFields } = formState
    const input: UpdateProductInput = { id: data.id }
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
  }

  const onSubmit: SubmitHandler<ProductFormInputs> = async data => {
    const promise = data.id ? updateProduct(data) : createProduct(data)
    return promise
      .then(() => reset(data))
      .catch(error => {
        const { message } = error as Error
        setError('root.serverError', {
          type: 'server',
          message: message
        })
      })
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
        {watchId ? '儲存變更' : '建立產品'}
      </LoadingButton>
    </>
  )
}
