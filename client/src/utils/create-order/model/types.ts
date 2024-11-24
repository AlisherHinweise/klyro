export interface IParams {
  timeInForce?: string
  postOnly?: boolean
  reduceOnly?: boolean
  triggerPrice?: number
  clientOrderId?: string
  slippage?: string
  vaultAddress?: string
}

export interface ICreateOrderProps {
  symbol: string
  type: string
  side: string
  amount: number
  price?: number
  params: IParams
}
