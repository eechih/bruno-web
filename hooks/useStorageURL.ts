/* eslint-disable no-unused-vars */

import useSWR, { Fetcher } from 'swr'

import { Storage } from '@/lib/aws/storage'

type Data = string
type Key = {
  objectKey: string
  accessLevel: 'private' | 'protected' | 'public'
}

const fetcher: Fetcher<Data, Key> = async ({ objectKey, accessLevel }) => {
  return Storage.get(objectKey, { level: accessLevel })
}

export default function useStorageURL(objectKey: string, accessLevel: string) {
  const key = {
    name: 'storageURL',
    objectKey: objectKey,
    accessLevel: accessLevel
  }
  const options = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  }
  const { data, isLoading, error } = useSWR(key, fetcher, options)

  return {
    url: data,
    isLoading,
    error
  }
}
