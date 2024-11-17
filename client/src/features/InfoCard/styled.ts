'use client'
import { Container, styled } from '@mui/material'

export const CardContainer = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 24px;
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
