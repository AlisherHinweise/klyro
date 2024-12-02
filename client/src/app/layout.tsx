import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@mui/material'
import { theme } from '@/features/theme/theme'
import WalletProvider from '@/features/context/WalletProvider'
import Navbar from '@/features/Navbar/Navbar'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata = {
  title: 'klyro',
  description: 'klyro platform',
  icons: {
    icon: '/logo_klyro.png',
    apple: '/logo_klyro.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <WalletProvider>
          <ThemeProvider theme={theme}>
            <Navbar />
            {children}
          </ThemeProvider>
        </WalletProvider>
      </body>
    </html>
  )
}
