'use client'
import {
  Container,
  styled,
  TextField,
  Typography,
  Divider,
} from '@mui/material'

export const CardContainer = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 24px;
`
export const InfoDivider = styled(Divider)``

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
