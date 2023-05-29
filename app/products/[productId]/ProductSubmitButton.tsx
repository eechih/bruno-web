'use client'

import moment from 'moment'
import { useRouter } from 'next/navigation'
import { startTransition } from 'react'
import { SubmitHandler, useFormContext } from 'react-hook-form'

import { LoadingButton } from '@/components/mui/lab'
import { CreateProductInput, UpdateProductInput } from '@/lib/bruno/types'
import { ProductFormInputs } from './ProductForm'

export default function ProductSubmitButton() {
  const { handleSubmit, reset, formState, watch } =
    useFormContext<ProductFormInputs>()
  const router = useRouter()
  const watchId = watch('id')

  const createProduct: SubmitHandler<ProductFormInputs> = async data => {
    const input: CreateProductInput = {
      name: data.name,
      price: Number(data.price),
      cost: Number(data.cost),
      description: data.description,
      provider: data.provider,
      offShelfAt: moment(
        data.offShelfDate + 'T' + data.offShelfTime
      ).toISOString()
    }

    const response = await fetch(`/api/products`, {
      method: 'POST',
      body: JSON.stringify(input)
    })
    const product = await response.json()
    reset({ ...data, id: product.id })
    await fetch(`/api/revalidate?path=/products/[productId]`)
    await fetch(`/api/revalidate?path=/products`)
    startTransition(() => {
      router.replace(`/products/${product.id}`)
    })
  }

  const updateProduct: SubmitHandler<ProductFormInputs> = async data => {
    if (watchId) {
      const input: UpdateProductInput = {
        id: watchId,
        name: data.name,
        price: Number(data.price),
        cost: Number(data.cost),
        description: data.description,
        provider: data.provider,
        offShelfAt: moment(
          data.offShelfDate + 'T' + data.offShelfTime
        ).toISOString()
      }
      await fetch(`/api/products`, {
        method: 'PUT',
        body: JSON.stringify(input)
      })
      reset(data)
      await fetch(`/api/revalidate?path=/products/[productId]`)
      await fetch(`/api/revalidate?path=/products`)
      startTransition(() => {
        router.refresh()
      })
    } else {
      await createProduct(data)
    }
  }

  return (
    <LoadingButton
      variant="contained"
      color="primary"
      onClick={handleSubmit(watchId ? updateProduct : createProduct)}
      disabled={!formState.isDirty || !formState.isValid}
      loading={formState.isSubmitting}
    >
      {watchId ? '儲存變更' : '建立產品'}
    </LoadingButton>
  )
}
