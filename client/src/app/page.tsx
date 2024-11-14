import { AmountCard } from '@/features/AmountCard/AmountCard'
import { CustomContainer } from './globalStyled'

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
