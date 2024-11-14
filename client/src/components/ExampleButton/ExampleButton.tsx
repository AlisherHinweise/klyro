'use client'
import React from 'react'
import { StyledButton } from './styled'
import { IExampleButton } from '@/types/ExampleButton'

export const ExampleButton: React.FC<IExampleButton> = ({ children }) => {
  return <StyledButton>{children}</StyledButton>
}
