import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavbarContainer, LogoContainer, LogoImage } from './styled';
import Link from 'next/link';

export default function Navbar() {
    
    return (
      <NavbarContainer>
        <LogoContainer>
          <Link href="/">
            <LogoImage src="globe.svg" alt="Klyro" />
          </Link>
        </LogoContainer>
        <div>
          <ConnectButton />
        </div>
      </NavbarContainer>
    )
}