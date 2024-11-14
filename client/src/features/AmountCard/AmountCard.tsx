import React, { useState } from 'react'
import { CardContent, Slider, Typography } from '@mui/material'
import { CardContainer, TwoColsContainer } from './styled'
import { CustomCard } from '@/components/CustomCard/CustomCard'
import { CustomInput } from '@/components/CustomInput/CustomInput'

export const AmountCard: React.FC = () => {
  const [leverage, setLeverage] = useState<number>(1)

  const handleLeverageChange = (event: Event, newValue: number | number[]) => {
    setLeverage(newValue as number)
  }

  return (
    <CustomCard>
      <CardContent>
        <Typography>Assets to supply</Typography>
        <CardContainer>
          <TwoColsContainer>
            <Typography>Amount: </Typography>
            <CustomInput />
          </TwoColsContainer>
          <TwoColsContainer>
            <Typography>Leverage: </Typography>
            <Slider
              value={leverage}
              onChange={handleLeverageChange}
              min={1}
              max={5}
              step={1}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}`}
              sx={{ width: '100%' }}
            />
          </TwoColsContainer>
        </CardContainer>
      </CardContent>
    </CustomCard>
  )
}
