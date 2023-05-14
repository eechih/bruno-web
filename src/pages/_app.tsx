import '@aws-amplify/ui-react/styles.css'
import { CacheProvider } from '@emotion/react'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { Amplify } from 'aws-amplify'
import type { AppProps } from 'next/app'
import Head from 'next/head'

import createEmotionCache from '@/createEmotionCache'
import theme from '@/theme'

const isLocalhost = Boolean(
  typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      ))
)

console.log('isLocalhost', isLocalhost)

Amplify.configure({
  API: {
    endpoints: [
      {
        name: 'brunoapi',
        endpoint: 'https://brunoapi.dev3.creditgodbackend.com.tw',
      },
    ],
  },
})

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  )
}
