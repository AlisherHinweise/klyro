'use client'
import React, { useState } from 'react'
import {
  Alert,
  CardContent,
  InputAdornment,
  Snackbar,
  SnackbarCloseReason,
} from '@mui/material'
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
import ccxt from 'ccxt'
import { CandleLoading } from '@/components/CandleLoading/CandleLoading'
import { useAccount } from 'wagmi'

export const AmountCard: React.FC = () => {
  const [amount, setAmount] = useState('')
  const [leverage, setLeverage] = useState(1)
  const [orderId, setOrderId] = useState<string>('')
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const { address } = useAccount()
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

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  const handleCreatePosition = async () => {
    setIsLoading(true)
    try {
      const exchange = new ccxt.hyperliquid()
      exchange.walletAddress = address!
      exchange.privateKey = process.env.NEXT_PUBLIC_API_PRIVATE_KEY

      exchange.setSandboxMode(true)

      const symbol = 'ETH/USDC:USDC'
      const side = 'sell'
      const amountInETH = parseFloat(amount)

      const params = {
        leverage: leverage.toString(),
      }

      await exchange.setMarginMode('isolated', symbol, params)

      const ticker = await exchange.fetchTicker(symbol)

      const price = Number(ticker.last) * 0.95

      const order = await exchange.createOrder(
        symbol,
        'market',
        side,
        amountInETH,
        price
      )
      if (order) {
        setOpen(true)
        setIsSuccess(true)
        setOrderId(order.id)
      }
    } catch (error) {
      console.error('Error creating position:', error)
      setOpen(true)
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClosePosition = async () => {
    setIsLoading(true)
    try {
      const exchange = new ccxt.hyperliquid()
      exchange.walletAddress = address!
      exchange.privateKey = process.env.NEXT_PUBLIC_API_PRIVATE_KEY!

      exchange.setSandboxMode(true)

      const symbol = 'ETH/USDC:USDC'

      const position = await exchange.fetchPosition(symbol)

      if (position && position.contracts && position.contracts > 0) {
        const contractsToClose = position.contracts
        const side = position.side === 'short' ? 'buy' : 'sell'

        const ticker = await exchange.fetchTicker(symbol)
        const price = ticker.last

        const params = {
          reduceOnly: true,
        }

        await exchange.createOrder(
          symbol,
          'market',
          side,
          contractsToClose,
          price,
          params
        )
        setOpen(true)
        setIsSuccess(true)
      } else {
        setOpen(true)
        setIsSuccess(false)
      }
    } catch (error) {
      console.error('Ошибка при закрытии позиции:', error)
      setOpen(true)
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isLoading && <CandleLoading />}
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
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
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
                  value={leverage}
                  onChange={(e, newValue) => setLeverage(newValue as number)}
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
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          severity={isSuccess ? 'success' : 'error'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {isSuccess
            ? 'Your position successfully opened!'
            : 'Oops! Something went wrong...'}
        </Alert>
      </Snackbar>
    </>
  )
}
