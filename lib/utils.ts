import moment from 'moment'

export const isServer = typeof window === 'undefined' ? false : true

export const isClient = !isServer

export const toOffShelfAt = (offShelfDate: string, offShelfTime: string) =>
  moment(offShelfDate + 'T' + offShelfTime).toISOString()
