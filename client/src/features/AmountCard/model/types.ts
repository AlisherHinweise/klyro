import { Dispatch, SetStateAction } from 'react'

export interface IAmountCardProps {
  amount: string
  setAmount: Dispatch<SetStateAction<string>>
  orderId: string
  setOrderId: Dispatch<SetStateAction<string>>
  leverage: number
  setLeverage: Dispatch<SetStateAction<number>>
}
