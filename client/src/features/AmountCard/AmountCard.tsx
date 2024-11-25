'use client'
import React from 'react'
import { CardContent, InputAdornment } from '@mui/material'
import {
  ButtonContainer,
  CardContainer,
  CustomButton,
  CustomContainer,
  CustomSlider,
  CustomTypography,
  InfoContainer,
  TwoColsContainer,
} from './styled'
import { CustomCard } from '@/components/CustomCard/CustomCard'
import { CustomInput } from '@/components/CustomInput/CustomInput'
import { useCancelOrder, useCreateOrder } from '@/utils/queries/hyperliquidApi'

export const AmountCard: React.FC = () => {
  const createOrderMutation = useCreateOrder()
  const cancelOrderMutation = useCancelOrder()

  const handleCreatePosition = () => {
    // TODO: убрать игнор
    //   @ts-ignore
    createOrderMutation.mutate({
      symbol: 'BTC/USDT',
      type: 'limit',
      side: 'buy',
      amount: 0.01,
      price: 35000,
      params: { timeInForce: 'Gtc', postOnly: true },
    })
  }

  const handleClosePosition = () => {
    // TODO: убрать игнор
    //   @ts-ignore
    cancelOrderMutation.mutate({
      id: 'order-id',
      symbol: 'BTC/USDT',
      params: {
        clientOrderId: '0x1234567890abcdef',
        vaultAddress: '0xVaultAddress',
      },
    })
  }
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
              <CustomSlider
                aria-label="Always visible"
                step={1}
                min={1}
                max={5}
                marks={marks}
              />
            </CustomContainer>
          </CardContainer>
        </CardContent>
      </CustomCard>

      <ButtonContainer>
        <CustomButton
          color="success"
          variant="contained"
          onClick={handleCreatePosition}
        >
          CREATE POSITION
        </CustomButton>
        <CustomButton color="secondary" variant="contained">
          MODIFY POSITION
        </CustomButton>
        <CustomButton
          color="error"
          variant="contained"
          onClick={handleClosePosition}
        >
          CLOSE POSITION
        </CustomButton>
      </ButtonContainer>
    </InfoContainer>
  )
}
