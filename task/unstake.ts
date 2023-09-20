import { Signer } from "ethers";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { IPoolEscrow } from "../typechain-types";

import contracts from "../src/contracts.json";

interface Arguments {
  stakedEthValue: string,
  rewardEthValue: string,
};

task("unstake", "Exchange StakedETH and RewardETH for native ETH")
  .addPositionalParam("stakedEthValue", "StakedETH to withdraw")
  .addPositionalParam("rewardEthValue", "RewardETH to withdraw")
  .setAction(async (
    args: Arguments,
    hre: HardhatRuntimeEnvironment,
  ): Promise<void> => {
    const stakedEthValue: bigint = hre.ethers.parseEther(args.stakedEthValue);
    const rewardEthValue: bigint = hre.ethers.parseEther(args.rewardEthValue);

    const escrow: IPoolEscrow = await hre.ethers.getContractAt("IPoolEscrow", contracts.escrow);

    const signers: Signer[] = await hre.ethers.getSigners();
    const signer: Signer = signers[0];
    const signerAddress: string = await signer.getAddress();

    console.log(`Wallet: ${signerAddress}`);
    console.log(
      "Unstaking: " +
        `${args.stakedEthValue} StakedETH and ` +
        `${args.rewardEthValue} StakedETH ...`
    );

    try {
      await escrow.connect(signer).request(stakedEthValue, rewardEthValue);
    } catch (err: any) {
      const message: string = err.message || "";
      if (message.indexOf("StakedEthToken: invalid sender") >= 0) {
        console.log(`Error: Configured wallet is not whitelisted.`);
      }
    }
  });
