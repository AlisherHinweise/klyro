import React from 'react'
import { InputAdornment } from '@mui/material'
import {
  InfoDivider,
  InfoInput,
  CustomTypography,
  TwoColsContainer,
} from './styled'

export interface InfoCardContentProps {
  title: string
  inputs: { name: string; adornment: string; placeholder?: string | number }[]
}

export const InfoCardContent: React.FC<InfoCardContentProps> = ({
  title,
  inputs,
}) => {
  return (
    <>
      <InfoDivider>{title}</InfoDivider>
      {inputs.map((input) => (
        <TwoColsContainer key={input.name}>
          <CustomTypography>{input.name}</CustomTypography>
          <InfoInput
            variant="standard"
            placeholder={input.placeholder ? String(input.placeholder) : '-'}
            slotProps={{
              input: {
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="start">
                    {input.adornment}
                  </InputAdornment>
                ),
              },
            }}
          />
        </TwoColsContainer>
      ))}
    </>
  )
}
