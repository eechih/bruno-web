import moment from 'moment'

import { Product } from '@/models'
import { ProductFormInputs } from './types'

export function getDefaultFormInputs(): ProductFormInputs {
  return {
    name: '',
    price: '',
    cost: '',
    provider: 'CAT',
    offShelfDate: moment().utcOffset(8).format('yyyy-MM-DD'),
    offShelfTime: '20:00',
    option: '',
    description: '',
    images: []
  }
}

export function convertToFormInputs(product: Product): ProductFormInputs {
  const offShelfAt = moment(product.offShelfAt)
  const offShelfDate = offShelfAt.isValid()
    ? offShelfAt.format('yyyy-MM-DD')
    : ''
  const offShelfTime = offShelfAt.isValid() ? offShelfAt.format('HH:mm') : ''
  const images = product.images
    ? product.images.map(image => {
        return { key: image }
      })
    : []

  return {
    id: product.id,
    name: product.name,
    price: product.price?.toString() ?? '',
    cost: product.cost?.toString() ?? '',
    provider: product.provider ?? '',
    offShelfDate,
    offShelfTime,
    description: product.description ?? '',
    option: '',
    images: images
  }
}
