import React from 'react'
import { InputAdornment } from '@mui/material'
import { InfoDivider, InfoInput } from '@/features/InfoCard/styled'
import { CustomTypography, TwoColsContainer } from '@/features/InfoCard/styled'

interface InfoCardContentProps {
  title: string
  inputs: [name: string, adornment: string]
}

const InfoCardContent: React.FC<InfoCardContentProps> = ({ title, inputs }) => {
  return (
    <>
      <InfoDivider>{title}</InfoDivider>
      {inputs.map((name, adornment) => (
        <TwoColsContainer>
          <CustomTypography>{name}</CustomTypography>
          <InfoInput
            variant="standard"
            placeholder="{0.0}"
            slotProps={{
              input: {
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="start">{adornment}</InputAdornment>
                ),
              },
            }}
          />
        </TwoColsContainer>
      ))}
    </>
  )
}
