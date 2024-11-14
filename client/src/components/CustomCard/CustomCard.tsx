import { Card, styled } from '@mui/material'
import React from 'react'

interface ICustomCard {
  children: React.ReactElement
}

export const CustomCard: React.FC<ICustomCard> = ({ children }) => {
  return <StyledCard>{children}</StyledCard>
}

const StyledCard = styled(Card)`
  background-color: #121928;
  border: 1px solid #141c2e;
  border-radius: 24px;
`
