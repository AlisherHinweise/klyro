import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavbarContainer, ButtonContainer, LogoContainer, LogoImage } from './styled';
import Link from 'next/link';

export default function Navbar() {
    
    return (
    <NavbarContainer>
        <LogoContainer>
          <Link href="/">
            <LogoImage src="globe.svg" alt="Klyro" />
          </Link>
        </LogoContainer>
        <ButtonContainer>
          <ConnectButton />
        </ButtonContainer>
    </NavbarContainer>
    )
}