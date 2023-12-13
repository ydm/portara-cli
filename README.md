# Portara CLI

Use Portara -- Blockdaemon's Liquid Staking solution -- via the command line interface.


### Setup

1. Clone this repository.
2. Install all dependencies: `npm install`.
3. Set the following environment variables:
  - `INFURA_APIKEY` -- An API Key for accessing an Ethereum node provided by [Infura](https://www.infura.io)
  - `MNEMONIC` -- Your wallet's secret key, hex encoded.


### Usage examples

Staking: Turn 1 ETH into [StakedETH](https://etherscan.io/address/0x65077fa7df8e38e135bd4052ac243f603729892d).
```
npx hardhat --network mainnet stake 1
```

Unstaking: Turn 1 [StakedETH](https://etherscan.io/address/0x65077fa7df8e38e135bd4052ac243f603729892d) and 0.1 [RewardEth](https://etherscan.io/address/0xcbe26dbc91b05c160050167107154780f36ceaab) back to ETH.
```
npx hardhat --network mainnet unstake 1 0.1
```

Check available balances:
```
npx hardhat --network mainnet balance
```

Optionally you can check the balances of another wallet:
```
npx hardhat --network hardhat balance 0xADDRESS
```


### Blockdaemon specific commands

List fee recipients:
```
npx hardhat --network mainnet list-fee-recipients
```

Claim fees:
```
npx hardhat --network claim <RECIPIENT>
```


### Playground

The `test/playground.ts` file presents the entire journey:
encompassing all necessary steps prior to executing either a staking
or unstaking operation.
