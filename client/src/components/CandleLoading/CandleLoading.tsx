import React from 'react'
import { Box, Typography } from '@mui/material'
import './CandleLoading.css'

export const CandleLoading: React.FC = () => {
  return (
    <Box className="candle-loading">
      <Box className="candles">
        <Box className="candle">
          <Box className="candle-body"></Box>
          <Box className="candle-wick green top"></Box>
          <Box className="candle-wick green bottom"></Box>
        </Box>
        <Box className="candle">
          <Box className="candle-body"></Box>
          <Box className="candle-wick red top"></Box>
          <Box className="candle-wick red bottom"></Box>
        </Box>
        <Box className="candle">
          <Box className="candle-body"></Box>
          <Box className="candle-wick green top"></Box>
          <Box className="candle-wick green bottom"></Box>
        </Box>
        <Box className="candle">
          <Box className="candle-body"></Box>
          <Box className="candle-wick red top"></Box>
          <Box className="candle-wick red bottom"></Box>
        </Box>
      </Box>
      <Typography variant="h6" className="loading-text">
        Loading...
      </Typography>
    </Box>
  )
}
