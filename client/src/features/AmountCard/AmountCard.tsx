import React from 'react'
import { CardContent, InputAdornment, Slider } from '@mui/material'
import {
  ButtonContainer,
  CardContainer,
  CustomButton,
  CustomContainer,
  CustomTypography,
  InfoContainer,
  TwoColsContainer,
} from './styled'
import { CustomCard } from '@/components/CustomCard/CustomCard'
import { CustomInput } from '@/components/CustomInput/CustomInput'

export const AmountCard: React.FC = () => {
  const marks = [
    {
      value: 1,
      label: 'x1',
    },
    {
      value: 2,
      label: 'x2',
    },
    {
      value: 3,
      label: 'x3',
    },
    {
      value: 4,
      label: 'x4',
    },
    {
      value: 5,
      label: 'x5',
    },
  ]

  return (
    <InfoContainer>
      <CustomCard>
        <CardContent>
          <CustomTypography
            sx={{ fontWeight: '800', justifyContent: 'center' }}
          >
            Assets to supply
          </CustomTypography>
          <CardContainer>
            <TwoColsContainer>
              <CustomTypography>Amount: </CustomTypography>
              <CustomInput
                placeholder={'0.0'}
                sx={{ width: '100%' }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="start">ETH</InputAdornment>
                    ),
                  },
                }}
              />
            </TwoColsContainer>
            <CustomContainer>
              <CustomTypography>Leverage: </CustomTypography>
              <Slider
                aria-label="Always visible"
                step={1}
                min={1}
                max={5}
                marks={marks}
                sx={{}}
              />
            </CustomContainer>
          </CardContainer>
        </CardContent>
      </CustomCard>

      <ButtonContainer>
        <CustomButton color="success" variant="contained">
          CREATE POSITION
        </CustomButton>
        <CustomButton color="secondary" variant="contained">
          MODIFY POSITION
        </CustomButton>
        <CustomButton color="error" variant="contained">
          CLOSE POSITION
        </CustomButton>
      </ButtonContainer>
    </InfoContainer>
  )
}
