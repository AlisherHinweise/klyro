import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import {INFURA_API_KEY, WALLET_PRIVATE_KEY, ARBISCAN_API_KEY} from "./private-keys"

const config: HardhatUserConfig = {
  networks: {
    arbitrumSepolia: {
      url: `https://arbitrum-sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [WALLET_PRIVATE_KEY],
    },
    arbitrum: {
      url: `https://arbitrum-mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [WALLET_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ARBISCAN_API_KEY,
    },
  },
  solidity: "0.8.27",
};

export default config;
