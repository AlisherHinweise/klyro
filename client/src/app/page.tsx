'use client'

import { AmountCard } from '@/features/AmountCard/AmountCard'
import { Container, styled } from '@mui/material'

export default function Home() {
  return (
    <CustomContainer>
      <div>
        <AmountCard />
      </div>
      <div>{/* TODO: тут располагается информация */}</div>
    </CustomContainer>
  )
}

const CustomContainer = styled(Container)`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`
