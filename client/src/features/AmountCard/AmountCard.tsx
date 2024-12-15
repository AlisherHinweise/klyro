'use client'

import React, { useState, useEffect } from 'react'
import {
  Alert,
  CardContent,
  Snackbar,
  SnackbarCloseReason,
  InputAdornment,
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
import { CandleLoading } from '@/components/CandleLoading/CandleLoading'
import { useAccount } from 'wagmi'
import { IAmountCardProps } from './model/types'
import { useOrderDetails } from '@/utils/CustomHooks/useOrderDetails'
import { useHyperliquidBalance } from '@/utils/CustomHooks/useHyperLiquidBalance'
import ccxt from 'ccxt'

export const AmountCard: React.FC<IAmountCardProps> = ({
  amount,
  setAmount,
  leverage,
  setLeverage,
  setOrderId,
}) => {
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const { address, isConnected } = useAccount()
  const {
    usdcBalance,
    isLoading: isBalanceLoading,
    fetchBalance,
  } = useHyperliquidBalance()
  const {
    orderDetails,
    isLoading: isOrderLoading,
    fetchOrderDetails,
  } = useOrderDetails(address)

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
      exchange.privateKey = process.env.NEXT_PUBLIC_API_PRIVATE_KEY!

      exchange.setSandboxMode(true)

      const symbol = 'ETH/USDC:USDC'
      const side = 'sell'
      const amountInUSD = parseFloat(amount)

      const params = {
        leverage: leverage.toString(),
      }

      await exchange.setMarginMode('isolated', symbol, params)

      const ticker = await exchange.fetchTicker(symbol)
      const price = ticker.last || 1

      const amountInETH = amountInUSD / price

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
        await fetchBalance()
        await fetchOrderDetails()
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
        await fetchBalance()
        await fetchOrderDetails()
      } else {
        setOpen(true)
        setIsSuccess(false)
      }
    } catch (error) {
      console.error('Error closing position:', error)
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
            <CustomTypography>
              Balance:{' '}
              {isBalanceLoading ? 'Loading...' : `${usdcBalance || 0} USDC`}
            </CustomTypography>
            <CardContainer>
              <TwoColsContainer>
                <CustomTypography>Amount: </CustomTypography>
                <CustomInput
                  placeholder={'0.0'}
                  sx={{ width: '100%' }}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isBalanceLoading}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="start">USD</InputAdornment>
                      ),
                    },
                  }}
                />
              </TwoColsContainer>
              <CustomContainer>
                <CustomTypography>Leverage: </CustomTypography>
                <CustomSlider
                  step={1}
                  min={1}
                  max={5}
                  value={leverage}
                  onChange={(e, newValue) => setLeverage(newValue as number)}
                  disabled={isBalanceLoading}
                />
              </CustomContainer>
            </CardContainer>
            <CustomTypography sx={{ marginTop: 2 }}>
              Open Position Details:
            </CustomTypography>
            {isOrderLoading ? (
              <CustomTypography>Loading...</CustomTypography>
            ) : orderDetails ? (
              <>
                <CustomTypography>
                  Contracts: {orderDetails.contracts}
                </CustomTypography>
                <CustomTypography>Side: {orderDetails.side}</CustomTypography>
                <CustomTypography>
                  Price: {orderDetails.price.toFixed(2)}
                </CustomTypography>
              </>
            ) : (
              <CustomTypography>No open positions</CustomTypography>
            )}
          </CardContent>
        </CustomCard>

        <ButtonContainer>
          <CustomButton
            color="success"
            variant="contained"
            onClick={handleCreatePosition}
            disabled={isBalanceLoading}
          >
            CREATE POSITION
          </CustomButton>
          <CustomButton
            color="error"
            variant="contained"
            onClick={handleClosePosition}
            disabled={isBalanceLoading}
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
            ? 'Operation successful!'
            : 'Oops! Something went wrong...'}
        </Alert>
      </Snackbar>
    </>
  )
}
