import moment from 'moment'

export const isServer = typeof window === 'undefined' ? false : true

export const isClient = !isServer

export const toOffShelfAt = (offShelfDate: string, offShelfTime: string) =>
  moment(offShelfDate + 'T' + offShelfTime).toISOString()

export const capitalize = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1)
}
