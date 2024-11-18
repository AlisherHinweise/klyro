'use client'
import { Container, styled } from '@mui/material'

export const CustomContainer = styled(Container)`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  max-width: 1440px !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  align-items: center;
  margin-top: 24px;
`
