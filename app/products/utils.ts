import moment from 'moment'

export const toOffShelfAt = (offShelfDate: string, offShelfTime: string) =>
  moment(offShelfDate + 'T' + offShelfTime).toISOString()
