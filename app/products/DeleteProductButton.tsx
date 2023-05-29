'use client'

import { useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

import { LoadingButton } from '@/components/mui/lab'
import { enqueueSnackbar } from '@/components/notistack'

type DeleteProductButtonProps = {
  id: string
  // eslint-disable-next-line no-unused-vars
  onSuccess?: (id: string) => void
}

export default function DeleteProductButton({
  id,
  onSuccess
}: DeleteProductButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const deleteProduct = async () => {
    // console.log('deleteProduct')
    setLoading(true)
    const res = await fetch(`/api/products?id=${id}`, {
      method: 'DELETE'
    })
    if (!res.ok) {
      const { error } = await res.json()
      throw Error(error.message)
    }
    if (onSuccess) onSuccess(id)
    enqueueSnackbar('刪除成功', {
      transitionDuration: { enter: 1000 },
      variant: 'success',
      autoHideDuration: 2000
    })
    await fetch(`/api/revalidate?path=/products`)
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <LoadingButton color="primary" onClick={deleteProduct} loading={loading}>
      刪除
    </LoadingButton>
  )
}
