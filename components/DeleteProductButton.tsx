'use client'
import { LoadingButton } from '@/components/mui/lab'
import { SnackbarProvider, enqueueSnackbar } from '@/components/notistack'
import useDeleteProduct from '@/hooks/useDeleteProduct'

type DeleteProductButtonProps = {
  id: string
  // eslint-disable-next-line no-unused-vars
  onSuccess?: (id: string) => void
}

export default function DeleteProductButton(props: DeleteProductButtonProps) {
  const { id, onSuccess } = props
  const { deleteProduct, isDeleting } = useDeleteProduct()

  const handleClick = async () => {
    await deleteProduct({ input: { id } })
    enqueueSnackbar('刪除成功', { variant: 'success' })
    if (onSuccess) onSuccess(id)
  }

  return (
    <>
      <SnackbarProvider />
      <LoadingButton color="primary" onClick={handleClick} loading={isDeleting}>
        刪除
      </LoadingButton>
    </>
  )
}
