import moment from 'moment'
import { isEmpty } from 'ramda'

import { Product } from '@/models'
import { ProductFormInputs } from './types'

export const stringifyOptions = (options?: string[][]): string => {
  if (!options) return ''
  return options.map(option => option.join('，')).join(' / ')
}

export const parseOptions = (optionsString: string): string[][] | undefined => {
  return optionsString
    .trim()
    .split('/')
    .filter(s => !isEmpty(s.trim()))
    .map(s =>
      s
        .split(/[,，]/)
        .map(s => s.trim())
        .filter(s => !isEmpty(s))
    )
}

export function getDefaultFormInputs(): ProductFormInputs {
  return {
    name: '',
    description: '',
    price: '',
    cost: '',
    provider: 'CAT',
    offShelfDate: moment().utcOffset(8).format('yyyy-MM-DD'),
    offShelfTime: '20:00',
    options: '',
    images: [],
    fbMessage: '',
    fbGroupId: ''
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
    description: product.description ?? '',
    price: product.price?.toString() ?? '',
    cost: product.cost?.toString() ?? '',
    provider: product.provider ?? '',
    offShelfDate,
    offShelfTime,
    options: stringifyOptions(product.options),
    images: images,
    fbMessage: product.fbMessage ?? '',
    fbGroupId: product.fbGroupId ?? ''
  }
}
