import { useState, useEffect } from 'react'
import ccxt from 'ccxt'

interface Position {
  contracts: number
  side: string
  // Добавьте другие свойства позиции
}

export const useOpenPosition = (address: string | undefined) => {
  const [openPosition, setOpenPosition] = useState<Position | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOpenPosition = async () => {
    if (!address) return

    setIsLoading(true)
    try {
      const exchange = new ccxt.hyperliquid()
      exchange.walletAddress = address
      exchange.privateKey = process.env.NEXT_PUBLIC_API_PRIVATE_KEY!

      const symbol = 'ETH/USDC:USDC' // Укажите нужный символ

      const position = (await exchange.fetchPosition(symbol)) as Position
      setOpenPosition(position)
    } catch (err) {
      console.error('Error fetching open position:', err)
      setError('Failed to fetch open position')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOpenPosition()
  }, [address])

  return { openPosition, isLoading, error, fetchOpenPosition }
}
