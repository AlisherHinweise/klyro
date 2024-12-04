'use client'
import { AmountCard } from '@/features/AmountCard/AmountCard'
import { CustomContainer } from './globalStyled'
import { InfoCard } from '@/features/InfoCard/InfoCard'
import { useState } from 'react'

export default function Home() {
  const [leverage, setLeverage] = useState(1)
  const [orderId, setOrderId] = useState<string>('')
  const [amount, setAmount] = useState('')

  return (
    <CustomContainer>
      <div>
        <AmountCard
          leverage={leverage}
          setLeverage={setLeverage}
          orderId={orderId}
          setOrderId={setOrderId}
          amount={amount}
          setAmount={setAmount}
        />
      </div>
      <div>
        <InfoCard amount={amount} leverage={leverage} orderId={orderId} />
      </div>
    </CustomContainer>
  )
}
