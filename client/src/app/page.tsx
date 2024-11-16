import { AmountCard } from '@/features/AmountCard/AmountCard'
import { CustomContainer } from './globalStyled'
import { InfoCard } from '@/features/InfoCard/InfoCard'

export default function Home() {
  return (
    <CustomContainer>
      <div>
        <AmountCard />
      </div>
      <div>
        <InfoCard />
      </div>
    </CustomContainer>
  )
}
