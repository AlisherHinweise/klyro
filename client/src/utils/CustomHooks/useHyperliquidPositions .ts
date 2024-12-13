import { useState, useEffect } from 'react'
import ccxt from 'ccxt'
import { Position as CCXTPosition } from 'ccxt'

// interface Position {
//   symbol: string
//   amount: number
//   price: number
// }

export const useHyperliquidPositions = (address: string | undefined) => {
  const [positions, setPositions] = useState<CCXTPosition[]>([])
  //   const [positions, setPositions] = useState<Position[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!address) return

    const fetchPositions = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const exchange = new ccxt.hyperliquid()
        exchange.walletAddress = address
        exchange.privateKey = process.env.NEXT_PUBLIC_API_PRIVATE_KEY!
        exchange.setSandboxMode(true)

        const openPositions = await exchange.fetchPositions()
        setPositions(openPositions)
      } catch (err) {
        console.error('Error fetching positions:', err)
        setError('Failed to fetch positions')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPositions()

    const interval = setInterval(fetchPositions, 5000) // Обновление каждые 5 секунд
    return () => clearInterval(interval)
  }, [address])

  return { positions, isLoading, error }
}
