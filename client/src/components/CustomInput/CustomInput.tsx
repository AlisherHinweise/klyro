import { Input, styled } from '@mui/material'
import React from 'react'

export const CustomInput = () => {
  return <StyledInput />
}

const StyledInput = styled(Input)`
  background-color: #19212f;
  border: 1px solid #1c2a43;
  border-radius: 8px;
`
