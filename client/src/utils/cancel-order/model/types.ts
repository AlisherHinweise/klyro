export interface ICancelParams {
  clientOrderId?: string
  vaultAddress?: string
}

export interface ICancelOrder {
  id: string
  symbol: string
  params?: ICancelParams
}
