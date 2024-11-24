import { hyperliquid } from '../ccxt/ccxtClient'
import { ICreateOrderProps } from './model/types'

export const createOrder = async ({
  symbol,
  type,
  side,
  amount,
  price,
  params,
}: ICreateOrderProps) => {
  try {
    const order = await hyperliquid.createOrder(
      symbol,
      type,
      side,
      amount,
      price,
      params
    )
    console.log('Order created:', order)
    return order
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}
