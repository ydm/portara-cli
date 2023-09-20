import { Signer } from "ethers";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import contracts from "../src/contracts.json";

interface Arguments {
  value: string,
};

task("stake", "Stake ETH to Portara")
  .addPositionalParam("value", "ETH value to stake")
  .setAction(async (
    args: Arguments,
    hre: HardhatRuntimeEnvironment,
  ): Promise<void> => {
    const value: bigint = hre.ethers.parseEther(args.value);

    const signers: Signer[] = await hre.ethers.getSigners();
    const signer: Signer = signers[0];
    const signerAddress: string = await signer.getAddress();

    console.log(`Wallet: ${signerAddress}`);
    console.log(`Staking: ${args.value} ETH ...`);

    try {
      await signer.sendTransaction({
        to: contracts.pool,
        value,
      });
    } catch (err: any) {
      const message: string = err.message || "";
      if (message.indexOf("Pool: invalid recipient address") >= 0) {
        console.log(`Error: Configured wallet is not whitelisted.`);
      }
    }
  });
