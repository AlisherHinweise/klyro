import { AmountCard } from '@/features/AmountCard/AmountCard'
import Navbar from '@/features/Navbar/Navbar'
import { CustomContainer } from './globalStyled'
import { InfoCard } from '@/features/InfoCard/InfoCard'

export default function Home() {
  return (
    <>
      <Navbar />
      <CustomContainer>
        <div>
          <AmountCard />
        </div>
        <div>
          <InfoCard />
        </div>
      </CustomContainer>
    </>
  )
}
