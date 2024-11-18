'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { WagmiProvider, http } from 'wagmi'
import { arbitrum, arbitrumSepolia } from 'wagmi/chains'
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

const config = getDefaultConfig({
  appName: 'Klyro',
  projectId: '57b23ce75f796b47b9737e1fe46b565e',
  chains: [arbitrumSepolia, arbitrum],
  transports: {
    [arbitrumSepolia.id]: http(
      'https://arbitrum-sepolia.infura.io/v3/4c3f30bf61654b41ad626a44f98adb49'
    ),
    [arbitrum.id]: http(
      'https://arbitrum-mainnet.infura.io/v3/4c3f30bf61654b41ad626a44f98adb49'
    ),
  },
  ssr: false,
})

const WalletProvider = ({ children }: { children: React.ReactNode }) => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider
        modalSize="compact"
        theme={darkTheme({
          accentColor: '#6e1ff7',
          accentColorForeground: 'white',
          borderRadius: 'small',
          fontStack: 'system',
          overlayBlur: 'small',
        })}
      >
        {children}
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
)

export default WalletProvider
