import { Amplify } from 'aws-amplify'
import { Inter } from 'next/font/google'
import './globals.css'

import awsConfig from '@/aws-exports'

const inter = Inter({ subsets: ['latin'] })

Amplify.configure(awsConfig)

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
