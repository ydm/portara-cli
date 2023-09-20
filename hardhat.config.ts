import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const { INFURA_APIKEY } = process.env;
const MAINNET: string = `https://mainnet.infura.io/v3/${INFURA_APIKEY}`;

const config: HardhatUserConfig = {
  networks: {
    mainnet: {
      chainId: 0x01,
      url: MAINNET,
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
