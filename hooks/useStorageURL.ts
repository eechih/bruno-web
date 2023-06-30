import * as React from 'react'

import { GetConfig, Storage } from '@/lib/aws/storage'

export interface UseStorageURL {
  url?: string
  error?: Error
  isLoading: boolean
}

export interface useStorageURLProps {
  key: string
  options?: GetConfig
}

export const useStorageURL = (
  props: useStorageURLProps
): UseStorageURL & { fetch: () => () => void } => {
  const { key, options } = props

  const [result, setResult] = React.useState<UseStorageURL>({
    isLoading: true
  })

  // Used to prevent an infinite loop on useEffect, because `options`
  // will have a different reference on every render
  const serializedOptions = JSON.stringify(options)

  const fetch = () => {
    setResult({ isLoading: true })

    const options = JSON.parse(serializedOptions) as GetConfig
    const promise = Storage.get(key, options)

    // Attempt to fetch storage object url
    promise
      .then(url => setResult({ url, isLoading: false }))
      .catch((error: Error) => setResult({ error, isLoading: false }))

    // Cancel current promise on unmount
    return () => {}
  }

  React.useEffect(fetch, [key, serializedOptions])

  return { ...result, fetch }
}
