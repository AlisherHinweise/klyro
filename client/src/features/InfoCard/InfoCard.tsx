import React from 'react'
import { CardContent } from '@mui/material'
import { InfoContainer, CardContainer } from './styled'
import { CustomCard } from '@/components/CustomCard/CustomCard'
import { InfoCardContent } from '@/components/CustomCardContent/InfoCardContent'
import { CustomTypography } from '@/components/CustomCardContent/styled'

export const inputDate = [
  { block: 1, name: 'Lend', adornment: 'ETH' },
  { block: 1, name: 'Borrow', adornment: 'ETH' },
  { block: 1, name: 'Laverage', adornment: 'x' },
  { block: 1, name: 'ROE', adornment: '%' },
  { block: 2, name: 'Health factor', adornment: '' },
  { block: 2, name: 'Liquidation price', adornment: '' },
  { block: 2, name: 'Current price', adornment: '' },
  { block: 3, name: 'Short hedge', adornment: '' },
  { block: 3, name: 'Funding profit', adornment: '' },
  { block: 3, name: 'Initial', adornment: '' },
]

export const InfoCard = () => {
  const inputDateBlock1 = inputDate.filter((item) => item.block === 1)
  const inputDateBlock2 = inputDate.filter((item) => item.block === 2)
  const inputDateBlock3 = inputDate.filter((item) => item.block === 3)
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
            <InfoCardContent title="Final State" inputs={inputDateBlock1} />
            <InfoCardContent
              title="Liquidation info"
              inputs={inputDateBlock2}
            />
            <InfoCardContent title="Short Hedge" inputs={inputDateBlock3} />
          </CardContainer>
        </CardContent>
      </CustomCard>
    </InfoContainer>
  )
}
