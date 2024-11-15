import { AmountCard } from '@/features/AmountCard/AmountCard'
import Navbar from '@/features/Navbar/Navbar'
import { CustomContainer } from './globalStyled'
import WalletProvider from '@/features/context/WalletProvider'

export default function Home() {
  return (
    <WalletProvider>
      <Navbar />
      <CustomContainer>
        <div>
          <AmountCard />
        </div>
        <div>{/* TODO: тут располагается информация */}</div>
      </CustomContainer>
    </WalletProvider>
  )
}
