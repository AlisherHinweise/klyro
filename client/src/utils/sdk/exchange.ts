import ccxt from 'ccxt'

export const exchange = new ccxt.hyperliquid()
exchange.walletAddress = String(process.env.NEXT_PUBLIC_API_WALLET_ADDRESS)
exchange.privateKey = String(process.env.NEXT_PUBLIC_API_PRIVATE_KEY)
exchange.setSandboxMode(true)
