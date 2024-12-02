import { ConnectButton } from '@rainbow-me/rainbowkit'
import { NavbarContainer, LogoContainer, LogoImage, NavbarBlur } from './styled'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <NavbarContainer>
      <LogoContainer>
        <Link href="/">
          <LogoImage>
            <Image src="/logo_klyro.png" alt="Klyro" fill objectFit="cover" />
          </LogoImage>
        </Link>
      </LogoContainer>
      <div>
        <ConnectButton
          chainStatus="icon"
          accountStatus="address"
          showBalance={false}
        />
      </div>
      <NavbarBlur />
    </NavbarContainer>
  )
}
