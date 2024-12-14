'use client'
import React, { useState, useEffect } from 'react'
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
import { CandleLoading } from '@/components/CandleLoading/CandleLoading'
import { useAccount } from 'wagmi'
import { IAmountCardProps } from './model/types'
import { useHyperliquidBalance } from '@/utils/CustomHooks/useHyperLiquidBalance'
import { useHyperliquidPositions } from '@/utils/CustomHooks/useHyperliquidPositions '

export const AmountCard: React.FC<IAmountCardProps> = ({
  amount,
  setAmount,
  leverage,
  setLeverage,
  setOrderId,
  orderId,
}) => {
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const { address, isConnected } = useAccount()
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const {
    usdcBalance,
    isLoading: isBalanceLoading,
    fetchBalance,
  } = useHyperliquidBalance()
  const {
    positions,
    isLoading: isPositionsLoading,
    error: positionsError,
  } = useHyperliquidPositions(address)

  useEffect(() => {
    if (isConnected) {
      setIsWalletConnected(true)
    } else {
      setIsWalletConnected(false)
    }
  }, [isConnected])

  const marks = [
    { value: 1, label: 'x1' },
    { value: 2, label: 'x2' },
    { value: 3, label: 'x3' },
    { value: 4, label: 'x4' },
    { value: 5, label: 'x5' },
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
      // Logic to create position (unchanged)
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
      // Logic to close position (unchanged)
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
              Open Positions
            </CustomTypography>
            {isPositionsLoading ? (
              <CustomTypography>Loading positions...</CustomTypography>
            ) : positionsError ? (
              <CustomTypography color="error">
                {positionsError}
              </CustomTypography>
            ) : positions.length > 0 ? (
              positions.map((position) => (
                <CustomTypography key={position.id}>
                  {position.symbol}: {position.contracts} contracts @{' '}
                  {position.entryPrice} USD
                </CustomTypography>
              ))
            ) : (
              <CustomTypography>No open positions</CustomTypography>
            )}
          </CardContent>
        </CustomCard>

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
                  disabled={!isWalletConnected || isBalanceLoading}
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
                  aria-label="Always visible"
                  step={1}
                  min={1}
                  max={5}
                  marks={marks}
                  value={leverage}
                  onChange={(e, newValue) => setLeverage(newValue as number)}
                  disabled={!isWalletConnected || isBalanceLoading}
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
            disabled={!isWalletConnected || isBalanceLoading}
          >
            CREATE POSITION
          </CustomButton>
          <CustomButton
            color="secondary"
            variant="contained"
            disabled={!isWalletConnected || isBalanceLoading}
          >
            MODIFY POSITION
          </CustomButton>
          <CustomButton
            color="error"
            variant="contained"
            onClick={handleClosePosition}
            disabled={!isWalletConnected || isBalanceLoading}
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
