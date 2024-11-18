import { ConnectButton } from '@rainbow-me/rainbowkit'
import { NavbarContainer, LogoContainer, LogoImage, NavbarBlur } from './styled'
import Link from 'next/link'

export default function Navbar() {
  return (
    <NavbarContainer>
      <LogoContainer>
        <Link href="/">
          <LogoImage src="globe.svg" alt="Klyro" />
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
