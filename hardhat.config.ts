import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "./task/balance";
import "./task/stake";
import "./task/unstake";

const { INFURA_APIKEY, MNEMONIC } = process.env;
const MAINNET: string = `https://mainnet.infura.io/v3/${INFURA_APIKEY}`;
const ACCOUNTS: Array<string> | undefined = MNEMONIC ? [MNEMONIC] : undefined;

const config: HardhatUserConfig = {
  networks: {
    mainnet: {
      chainId: 0x01,
      url: MAINNET,
      accounts: ACCOUNTS,
    },
    hardhat: {
      forking: {
        enabled: true,
        url: MAINNET,
        blockNumber: 18176000,
      },
    },
  },
  solidity: "0.8.16",
};

export default config;
