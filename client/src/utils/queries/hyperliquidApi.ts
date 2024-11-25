'use client'
import { useMutation } from '@tanstack/react-query'
import { createOrder } from '../create-order/createOrder'
import { cancelOrder } from '../cancel-order/cancel-order'
import { ICreateOrderProps } from '../create-order/model/types'
import { ICancelOrder } from '../cancel-order/model/types'

export const useCreateOrder = () => {
  // TODO: убрать игнор
  //   @ts-ignore
  return useMutation((orderData: ICreateOrderProps) => createOrder(orderData))
}

export const useCancelOrder = () => {
  // TODO: убрать игнор
  //   @ts-ignore
  return useMutation((orderData: ICancelOrder) => cancelOrder(orderData))
}
