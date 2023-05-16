'use client'

import { GraphQLQuery } from '@aws-amplify/api'
import LoadingButton from '@mui/lab/LoadingButton'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { API, Amplify, Cache } from 'aws-amplify'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useEffect } from 'react'
import {
  Control,
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormContext,
} from 'react-hook-form'

import awsConfig from '@/aws-exports'
import Layout from '@/components/Layout'
import StorageManager, {
  HashHexFileNameStrategy,
} from '@/components/StorageManager'
import WrappedBreadcrumbs from '@/components/WrappedBreadcrumbs'
import { ErrorMessage, Input, Select } from '@/components/forms'
import * as api from '@/graphql/API'
import * as mutations from '@/graphql/mutations'
import * as queries from '@/graphql/queries'

Amplify.configure(awsConfig)

enum Mode {
  CREATION = 'creation',
  EDITION = 'edition',
}

const providers = [
  {
    value: '',
    label: '-',
  },
  {
    value: 'CAT',
    label: '葉貓子 日韓彩妝食品雜貨批發社團',
  },
  {
    value: 'MONEY',
    label: 'MONEY株式會社',
  },
  {
    value: 'APPLE',
    label: 'GAUK✿日韓台✿彩妝&用品&食品&銀飾等商品',
  },
  {
    value: 'MITAGO',
    label: 'Mitago商城',
  },
]

type Inputs = {
  name: string
  price: string
  cost: string
  provider: string
  offShelfDate: string
  offShelfTime: string
  description: string
  option: string
  images: { key: string }[]
}

const initialInputs: Inputs = {
  name: '',
  price: '',
  cost: '',
  provider: 'CAT',
  offShelfDate: moment().utcOffset(8).format('yyyy-MM-DD'),
  offShelfTime: '20:00',
  option: '',
  description: '',
  images: [],
}

function ImageFieldArray(props: {
  control: Control<Inputs>
  mode: Mode
  productId?: string
}) {
  const { control, mode, productId } = props
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images',
  })
  const { resetField } = useFormContext()

  return (
    <StorageManager
      acceptedFileTypes={['image/*']}
      accessLevel="private"
      defaultFiles={fields}
      processFile={HashHexFileNameStrategy}
    />
  )
}

let renderCount = 0

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params
  const mode = id == 'create' ? Mode.CREATION : Mode.EDITION
  const productId = id
  console.log('productId', productId)

  const router = useRouter()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true })

  const methods = useForm<Inputs>({ defaultValues: initialInputs })
  const { reset, handleSubmit, control, formState, setError } = methods
  const { isDirty, isValid, dirtyFields, isSubmitting, errors } = formState
  renderCount++

  useEffect(() => {
    const loadData = async (productId: string) => {
      console.log('loadData', productId)
      let product = Cache.getItem(productId)
      if (!product) {
        const res = await API.graphql<GraphQLQuery<api.GetProductQuery>>({
          query: queries.getProduct,
          variables: {
            id: productId,
          },
        })
        product = res.data?.getProduct
      }
      if (product) {
        const cacheExpires = 900 * 1000 // 15 minutes
        Cache.setItem(productId, product, {
          expires: new Date().getTime() + cacheExpires,
        })
        const values = {
          name: product.name,
          price: product.price?.toString(),
          cost: product.cost?.toString(),
          provider: product.provider ?? '',
          offShelfDate: moment(product.offShelfAt).format('yyyy-MM-DD'),
          offShelfTime: moment(product.offShelfAt).format('HH:mm'),
          description: product.description ?? '',
          option: '',
        } as Inputs
        reset(values)
      }
    }
    if (mode == Mode.EDITION && productId) loadData(productId)
  }, [mode, productId, reset])

  const createProduct = async (data: Inputs) => {
    // console.log('createProduct', data)
    const variables: api.CreateProductMutationVariables = {
      input: {
        name: data.name,
        price: Number(data.price),
        cost: Number(data.cost),
        description: data.description,
        provider: data.provider,
      },
    }
    const res = await API.graphql<GraphQLQuery<api.CreateProductMutation>>({
      query: mutations.createProduct,
      variables: variables,
    })
    console.log('res', res)
  }

  const updateProdcut = async (productId: string, data: Inputs) => {
    console.log('updateProdcut', data)
  }

  const onSubmit: SubmitHandler<Inputs> = async data => {
    const promise =
      mode == Mode.EDITION && productId
        ? updateProdcut(productId, data)
        : createProduct(data)
    return promise.catch(error => {
      console.log(error)
      const { message } = error as Error
      setError('root.serverError', {
        type: 'server',
        message: message,
      })
    })
  }

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      const message = mode == Mode.EDITION ? '儲存成功!' : '新增成功!'
      enqueueSnackbar(message, { variant: 'success', autoHideDuration: 2000 })
      // if (mode == Mode.CREATION) router.push('/products')
    }
  }, [formState, mode, router])

  // if (!router.isReady) return <div>Loading...</div>

  return (
    <Layout>
      <SnackbarProvider />
      <Container disableGutters sx={{ marginLeft: 0 }}>
        <WrappedBreadcrumbs
          links={[
            { children: '首頁', href: '/' },
            { children: '產品列表', href: '/products' },
            { children: mode == Mode.EDITION ? '編輯產品' : '建立產品' },
          ]}
        />
        <Stack
          direction="row"
          py={2}
          justifyContent="space-between"
          alignItems="center"
        >
          {mode == Mode.EDITION && productId ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6">產品</Typography>
              <Typography variant="body1">
                {matches ? productId : productId.substring(0, 8)}
              </Typography>
            </Stack>
          ) : (
            <Typography variant="h6">建立產品</Typography>
          )}
        </Stack>

        <FormProvider {...methods}>
          <Grid container spacing={2}>
            <Grid xs={12} md={6}>
              <Paper variant={matches ? 'outlined' : 'elevation'} elevation={0}>
                <Grid container spacing={2} padding={matches ? 2 : 0}>
                  <Grid>
                    <Typography variant="h6">基本設定</Typography>
                  </Grid>
                  <Grid xs={12}>
                    <Input
                      name="name"
                      control={control}
                      rules={{ required: '必須提供名稱' }}
                      label="名稱"
                      type="txt"
                      required
                      fullWidth
                      autoFocus={mode == Mode.CREATION}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <Input
                      name="price"
                      control={control}
                      rules={{
                        required: '必須提供售價',
                        min: { value: 0, message: '售價不可小於零' },
                      }}
                      label="價格"
                      type="number"
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid xs={12}>
                    <Input
                      name="option"
                      control={control}
                      label="規格"
                      type="txt"
                      fullWidth
                      helperText="'範例：紅，黑，白 / XL，L，M'"
                    />
                  </Grid>
                  <Grid xs={12}>
                    <Select
                      name="provider"
                      control={control}
                      label="供應商"
                      options={providers}
                      fullWidth
                    />
                  </Grid>
                  <Grid xs={12}>
                    <Input
                      name="cost"
                      control={control}
                      rules={{
                        min: { value: 0, message: '成本不可小於零' },
                      }}
                      label="成本"
                      type="number"
                      fullWidth
                    />
                  </Grid>
                  <Grid xs={6}>
                    <Input
                      name="offShelfDate"
                      control={control}
                      label="下架日期"
                      type="date"
                      fullWidth
                    />
                  </Grid>
                  <Grid xs={6}>
                    <Input
                      name="offShelfTime"
                      control={control}
                      label="下架時間"
                      type="time"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid xs={12} md={6}>
              <Paper variant={matches ? 'outlined' : 'elevation'} elevation={0}>
                <Grid container spacing={2} padding={matches ? 2 : 0}>
                  <Grid>
                    <Typography variant="h6">社群貼文內容</Typography>
                  </Grid>
                  <Grid xs={12}>
                    <Input
                      name="description"
                      type="txt"
                      control={control}
                      label="描述"
                      fullWidth
                      minRows={15}
                      multiline
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid xs={12}>
              <Paper variant={matches ? 'outlined' : 'elevation'} elevation={0}>
                <Grid container spacing={2} padding={matches ? 2 : 0}>
                  <Grid>
                    <Typography variant="h6">產品圖片</Typography>
                  </Grid>
                  <Grid xs={12}>
                    <ImageFieldArray
                      control={control}
                      mode={mode}
                      productId={productId ?? undefined}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid xs={12}>
              <Stack direction="row" justifyContent="end" spacing={2}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => router.push('/products')}
                >
                  取消
                </Button>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit(onSubmit)}
                  disabled={!isDirty || !isValid}
                  loading={isSubmitting}
                >
                  {mode == Mode.EDITION ? '儲存變更' : '建立產品'}
                </LoadingButton>
              </Stack>
            </Grid>
            <Grid xs={12}>
              {errors.root && <ErrorMessage error={errors.root} />}
            </Grid>
            <Grid xs={12}>
              <div>Render Count: {renderCount}</div>
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
    </Layout>
  )
}
