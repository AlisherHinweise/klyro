import { AmountCard } from '@/features/AmountCard/AmountCard'
import Navbar from '@/features/Navbar/Navbar'
import { CustomContainer } from './globalStyled'

export default function Home() {
  return (
    <>
      <Navbar />
      <CustomContainer>
        <div>
          <AmountCard />
        </div>
        <div>{/* TODO: тут располагается информация */}</div>
      </CustomContainer>
    </>
  )
}
