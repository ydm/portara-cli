import { Signer } from "ethers";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { IERC20Upgradeable } from "../typechain-types";

import contracts from "../src/contracts.json";

interface Arguments {
  address: string,
};

task("balance", "Check your Portara balances")
  .addPositionalParam("address", "Wallet to check", "0xdead", undefined, true)
  .setAction(async (
    args: Arguments,
    hre: HardhatRuntimeEnvironment,
  ): Promise<void> => {
    const signers: Signer[] = await hre.ethers.getSigners();
    const signer: Signer = signers[0];
    const signerAddress: string = await signer.getAddress();
    const address: string = args.address || signerAddress;

    const steth: IERC20Upgradeable = await hre.ethers.getContractAt("IERC20Upgradeable", contracts.stakedEth);
    const rweth: IERC20Upgradeable = await hre.ethers.getContractAt("IERC20Upgradeable", contracts.rewardEth);

    const staked: string = await steth.balanceOf(address).then(hre.ethers.formatEther);
    const reward: string = await rweth.balanceOf(address).then(hre.ethers.formatEther);

    console.log(`Wallet: ${address}`);
    console.log(`StakedETH: ${staked}`);
    console.log(`RewardETH: ${reward}`);
  });
