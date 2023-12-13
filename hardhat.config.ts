import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "./task/balance";
import "./task/claim";
import "./task/list-fee-recipients";
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
    local: {
      chainId: 31337,
      url: "http://127.0.0.1:8545/",
    },
    hardhat: {
      forking: {
        enabled: true,
        url: MAINNET,
        blockNumber: 18620800,
      },
    },
  },
  solidity: "0.8.16",
};

export default config;
