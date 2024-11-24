import ccxt from 'ccxt'

export const hyperliquid = new ccxt.hyperliquid({
  apiKey: process.env.HYPERLIQUID_API_KEY,
  secret: process.env.HYPERLIQUID_SECRET_KEY,
})
