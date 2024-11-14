import React from 'react'
import { StyledCard } from './styled'

interface ICustomCard {
  children: React.ReactElement
}

export const CustomCard: React.FC<ICustomCard> = ({ children }) => {
  return <StyledCard>{children}</StyledCard>
}
