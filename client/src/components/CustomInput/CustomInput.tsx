import { TextFieldProps } from '@mui/material'
import React from 'react'
import { StyledInput } from './styled'

export const CustomInput: React.FC<TextFieldProps> = (props) => {
  return <StyledInput {...props} />
}
