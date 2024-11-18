'use client'
import { Button, Container, Slider, styled, Typography } from '@mui/material'

export const CardContainer = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 24px;
`

export const CustomTypography = styled(Typography)`
  display: flex;
  align-items: center;
  text-transform: uppercase;
`

export const TwoColsContainer = styled('div')`
  display: flex;
  gap: 24px;
`

export const CustomContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  padding-left: 0 !important;
  padding-right: 0 !important;
  gap: 16px !important;
`

export const InfoContainer = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 36px;
`

export const ButtonContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`

export const CustomButton = styled(Button)`
  width: 200px;
  border-radius: 10px;
  color: #fff;
  background-color: rgba(18, 25, 40, 0.36);
  position: relative;
  cursor: pointer;
  z-index: 0;

  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    background: linear-gradient(
      45deg,
      #ff0000,
      #ff7300,
      #fffb00,
      #48ff00,
      #00ffd5,
      #002bff,
      #7a00ff,
      #ff00c8,
      #ff0000
    );
    background-size: 400%;
    filter: blur(5px);
    z-index: -1;
    animation: glowing 20s linear infinite;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    border-radius: 10px;
  }

  &:hover:before {
    opacity: 1;
  }

  &:active {
    color: #000;
  }

  &:active:after {
    background: transparent;
  }

  &:after {
    z-index: -1;
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(18, 25, 40, 0.36);
    left: 0;
    top: 0;
    border-radius: 10px;
  }

  @keyframes glowing {
    0% {
      background-position: 0 0;
    }
    50% {
      background-position: 400% 0;
    }
    100% {
      background-position: 0 0;
    }
  }
`

export const CustomSlider = styled(Slider)`
  & .MuiSlider-track {
    background: linear-gradient(90deg, #00aaff, #0077ff, #0055cc);
    border: none;
    height: 8px;
    border-radius: 4px;
  }

  & .MuiSlider-rail {
    background: #b3c8d5;
    height: 8px;
    border-radius: 4px;
  }

  & .MuiSlider-thumb {
    background-color: #fff;
    border: 2px solid #0077ff;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    transition:
      background-color 0.2s ease,
      transform 0.2s ease;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  }

  & .MuiSlider-thumb:hover {
    background-color: #0077ff;
  }

  & .MuiSlider-thumb:active {
    background-color: #0055cc;
  }

  & .MuiSlider-markLabel {
    color: #fff;
    font-size: 14px;
    font-weight: bold;
  }
`
