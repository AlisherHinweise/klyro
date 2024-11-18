'use client'
import { styled } from '@mui/material'

export const NavbarContainer = styled('nav')`
  display: flex;
  background-color: rgba(33, 33, 33, 0.7);
  color: #ffffff;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 16px;
  backdrop-filter: blur(10.6px);
  -webkit-backdrop-filter: blur(10.6px);
  border: 1px solid rgba(63, 137, 255, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  position: relative;
`

export const LogoContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const LogoImage = styled('img')`
  width: 30px;
  height: 30px;
  object-fit: cover;
`

export const NavbarBlur = styled('div')`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 10px;
  background: linear-gradient(
    to bottom,
    rgba(33, 33, 33, 0),
    rgba(33, 33, 33, 0.3)
  );
  border-radius: 0 0 16px 16px;
`
