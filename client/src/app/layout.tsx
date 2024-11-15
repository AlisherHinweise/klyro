import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@mui/material'
import { theme } from '@/features/theme/theme'
import WalletProvider from '@/features/context/WalletProvider'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <WalletProvider>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </WalletProvider>
      </body>
    </html>
  )
}
