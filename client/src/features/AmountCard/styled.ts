import { styled } from '@mui/material'

export const CardContainer = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const TwoColsContainer = styled('div')`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* исправлено на правильное название */
`
