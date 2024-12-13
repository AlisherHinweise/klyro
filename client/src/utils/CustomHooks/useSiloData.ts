import { useEffect, useState } from 'react'

const WS_URL = 'wss://silo.example.com/socket' // Укажите реальный URL WebSocket

export const useSiloData = () => {
  const [data, setData] = useState({
    usdcLendRate: 0, // Значение по умолчанию
    fundingRate: 0, // Значение по умолчанию
    ethPrice: 0, // Значение по умолчанию
  })

  useEffect(() => {
    const ws = new WebSocket(WS_URL)

    ws.onopen = () => {
      console.log('WebSocket connected')
      ws.send(
        JSON.stringify({
          type: 'subscribe',
          data: ['usdc', 'fundingRate', 'ethPrice'],
        })
      )
    }

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        if (message.type === 'update') {
          const { usdcLendRate, fundingRate, ethPrice } = message.data || {}
          setData({
            usdcLendRate: usdcLendRate ?? 0,
            fundingRate: fundingRate ?? 0,
            ethPrice: ethPrice ?? 0,
          })
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    return () => {
      ws.close()
    }
  }, [])

  return data
}
