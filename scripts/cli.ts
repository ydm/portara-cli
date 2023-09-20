import { task } from "hardhat/config";
import { ethers } from "hardhat";
import { IERC20Upgradeable, IPoolEscrow, IWhiteListManager } from "../typechain-types";

const PORTARA = {
  POOL: "0xeA6b7151b138c274eD8d4D61328352545eF2D4b7",
  ESCROW: "0xa57C8861d923B57A09BC9270fA76198c8cDCB002",
  WHITELIST: "0x57a9cbED053f37EB67d6f5932b1F2f9Afbe347F3",
  STAKED_ETH: "0x65077fA7Df8e38e135bd4052ac243F603729892d",
  REWARD_ETH: "0xCBE26dbC91B05C160050167107154780F36CeAAB",

  ADMIN: "0x6C7692dB59FDC7A659208EEE57C2c876aE54a448",
};

async function main() {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const unlockTime = currentTimestampInSeconds + 60;

  // const lockedAmount = ethers.parseEther("0.001");

  // const lock = await ethers.deployContract("Lock", [unlockTime], {
  //   value: lockedAmount,
  // });

  // await lock.waitForDeployment();

  // console.log(
  //   `Lock with ${ethers.formatEther(
  //     lockedAmount
  //   )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
  // );

  console.log(process.argv);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
