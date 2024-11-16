import React from 'react'
import { CardContent, InputAdornment } from '@mui/material'
import {
  InfoContainer,
  CustomTypography,
  CardContainer,
  TwoColsContainer,
  InfoInput,
  InfoDivider,
} from './styled'
import { CustomCard } from '@/components/CustomCard/CustomCard'

export const InfoCard = () => {
  return (
    <InfoContainer>
      <CustomCard>
        <CardContent>
          <CustomTypography
            sx={{
              fontWeight: '800',
              justifyContent: 'center',
              textTransform: 'uppercase',
            }}
          >
            Info
          </CustomTypography>
          <CardContainer>
            <InfoDivider>Final state</InfoDivider>
            <TwoColsContainer>
              <CustomTypography>Lend</CustomTypography>
              <InfoInput
                variant="standard"
                placeholder={'0.0'}
                slotProps={{
                  input: {
                    disableUnderline: true,
                    endAdornment: (
                      <InputAdornment position="start">ETH</InputAdornment>
                    ),
                  },
                }}
              />
            </TwoColsContainer>
            <TwoColsContainer>
              <CustomTypography>Borrow</CustomTypography>
              <InfoInput
                variant="standard"
                placeholder={'0.0'}
                slotProps={{
                  input: {
                    disableUnderline: true,
                    endAdornment: (
                      <InputAdornment position="start">ETH</InputAdornment>
                    ),
                  },
                }}
              />
            </TwoColsContainer>
            <TwoColsContainer>
              <CustomTypography>Leverage</CustomTypography>
              <InfoInput
                variant="standard"
                placeholder={'0.0'}
                slotProps={{
                  input: {
                    disableUnderline: true,
                    endAdornment: (
                      <InputAdornment position="start">X</InputAdornment>
                    ),
                  },
                }}
              />
            </TwoColsContainer>
            <TwoColsContainer>
              <CustomTypography>ROE</CustomTypography>
              <InfoInput
                variant="standard"
                placeholder={'0.0'}
                slotProps={{
                  input: {
                    disableUnderline: true,
                    endAdornment: (
                      <InputAdornment position="start">%</InputAdornment>
                    ),
                  },
                }}
              />
            </TwoColsContainer>

            <InfoDivider>Liquidation info</InfoDivider>
            <TwoColsContainer>
              <CustomTypography>Health factor</CustomTypography>
              <InfoInput
                variant="standard"
                placeholder={'0.0'}
                slotProps={{
                  input: {
                    disableUnderline: true,
                  },
                }}
              />
            </TwoColsContainer>
            <TwoColsContainer>
              <CustomTypography>Liquidation price</CustomTypography>
              <InfoInput
                variant="standard"
                placeholder={'0.0'}
                slotProps={{
                  input: {
                    disableUnderline: true,
                  },
                }}
              />
            </TwoColsContainer>
            <TwoColsContainer>
              <CustomTypography>Current Price</CustomTypography>
              <InfoInput
                variant="standard"
                placeholder={'0.0'}
                slotProps={{
                  input: {
                    disableUnderline: true,
                  },
                }}
              />
            </TwoColsContainer>
            <InfoDivider>Short hedge</InfoDivider>
            <TwoColsContainer>
              <CustomTypography>Short hedge</CustomTypography>
              <InfoInput
                variant="standard"
                placeholder={'0.0'}
                slotProps={{
                  input: {
                    disableUnderline: true,
                  },
                }}
              />
            </TwoColsContainer>
            <TwoColsContainer>
              <CustomTypography>Funding profit</CustomTypography>
              <InfoInput
                variant="standard"
                placeholder={'0.0'}
                slotProps={{
                  input: {
                    disableUnderline: true,
                  },
                }}
              />
            </TwoColsContainer>
            <TwoColsContainer>
              <CustomTypography>Initial</CustomTypography>
              <InfoInput
                variant="standard"
                placeholder={'0.0'}
                slotProps={{
                  input: {
                    disableUnderline: true,
                  },
                }}
              />
            </TwoColsContainer>
          </CardContainer>
        </CardContent>
      </CustomCard>
    </InfoContainer>
  )
}
