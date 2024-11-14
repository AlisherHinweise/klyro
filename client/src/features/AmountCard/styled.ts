'use client'
import { Button, Container, styled, Typography } from '@mui/material'

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
  -webkit-box-shadow: 5px 5px 8px 3px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 5px 5px 8px 3px rgba(34, 60, 80, 0.2);
  box-shadow: 5px 5px 8px 3px rgba(34, 60, 80, 0.2);
`
