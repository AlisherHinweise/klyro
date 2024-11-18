'use client'
import { styled, TextField, Typography, Divider } from '@mui/material'

export const InfoInput = styled(TextField)`
  display: flex;
  width: 150px;
  text-align: right;
  & .MuiInputBase-root {
    & .MuiInputBase-input {
      padding: 7px;
      text-align: right;
    }
    & .MuiInputBase-input::placeholder {
      text-align: end;
    }
  }
`
export const InfoDivider = styled(Divider)``

export const CustomTypography = styled(Typography)`
  display: flex;
  align-items: center;
  text-transform:;
`
export const TwoColsContainer = styled('div')`
  display: flex;
  justify-content: center;
  justify-content: space-between;
  align-items: center;
  margin-bottom: -10px;
  margin-top: -10px;
`
