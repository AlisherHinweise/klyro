// useHyperliquidBalance.ts
import { useState, useEffect } from 'react'
import ccxt from 'ccxt'
import { useAccount } from 'wagmi'

export const useHyperliquidBalance = () => {
  const { address, isConnected } = useAccount()
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchBalance = async () => {
    if (!address) return
    try {
      setIsLoading(true)
      const exchange = new ccxt.hyperliquid()
      exchange.walletAddress = address
      exchange.privateKey = process.env.NEXT_PUBLIC_API_PRIVATE_KEY!
      exchange.setSandboxMode(true)

      const balance = await exchange.fetchBalance()
      setUsdcBalance(balance.USDC.total || 0) // Установка баланса USDC
    } catch (error) {
      console.error('Ошибка при получении баланса:', error)
      setUsdcBalance(null) // Сброс баланса в случае ошибки
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected) {
      fetchBalance()
    }
  }, [isConnected])

  return { usdcBalance, isLoading, fetchBalance }
}
