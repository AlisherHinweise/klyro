import { hyperliquid } from '../ccxt/ccxtClient'
import { ICancelOrder } from './model/types'

export const cancelOrder = async ({ id, symbol, params }: ICancelOrder) => {
  try {
    const canceledOrder = await hyperliquid.cancelOrder(id, symbol, params)
    console.log('Order canceled:', canceledOrder)
    return canceledOrder
  } catch (error) {
    console.error('Error canceling order:', error)
    throw error
  }
}
