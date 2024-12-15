import { useState, useEffect, useCallback } from 'react'
import ccxt from 'ccxt'

interface OrderDetails {
  contracts: number
  side: string
  price: number
}

export const useOrderDetails = (address: string | undefined) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrderDetails = useCallback(async () => {
    if (!address) return

    setIsLoading(true)
    try {
      const exchange = new ccxt.hyperliquid()
      exchange.walletAddress = address
      exchange.privateKey = process.env.NEXT_PUBLIC_API_PRIVATE_KEY!

      const symbol = 'ETH/USDC:USDC'
      const position = await exchange.fetchPosition(symbol)

      const positions = await exchange.fetchPositions()
      console.log('Positions:', positions)

      console.log('Position Data:', position)

      console.log('Position contracts:', position.contracts)
      console.log('Position side:', position.side)
      console.log('Position entryPrice:', position.entryPrice)

      if (position) {
        setOrderDetails({
          contracts: position.contracts ?? 0,
          side: position.side ?? 'unknown',
          price: position.entryPrice ?? 0,
        })
      } else {
        setOrderDetails(null)
      }
    } catch (err) {
      console.error('Error fetching order details:', err)
      setError('Failed to fetch order details')
    } finally {
      setIsLoading(false)
    }
  }, [address])

  useEffect(() => {
    fetchOrderDetails()
    const interval = setInterval(fetchOrderDetails, 10000)
    return () => clearInterval(interval)
  }, [fetchOrderDetails])

  return { orderDetails, isLoading, error, fetchOrderDetails }
}
