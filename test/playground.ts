import "@nomicfoundation/hardhat-ethers";
import { ethers, network } from "hardhat";
import { Signer, TransactionResponse } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";

import { IERC20Upgradeable, IPoolEscrow, IWhiteListManager } from "../typechain-types";

const PORTARA = {
  POOL: "0xeA6b7151b138c274eD8d4D61328352545eF2D4b7",
  ESCROW: "0xa57C8861d923B57A09BC9270fA76198c8cDCB002",
  WHITELIST: "0x57a9cbED053f37EB67d6f5932b1F2f9Afbe347F3",
  STAKED_ETH: "0x65077fA7Df8e38e135bd4052ac243F603729892d",
  REWARD_ETH: "0xCBE26dbC91B05C160050167107154780F36CeAAB",

  ADMIN: "0x6C7692dB59FDC7A659208EEE57C2c876aE54a448",
};

async function impersonate<T>(
    who: string,
    f: (signer: Signer) => Promise<T>
): Promise<T> {
    const norm: string = ethers.getAddress(who);
    await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [norm],
    });
    const signer = await ethers.getSigner(who);
    try {
        return await f(signer);
    } finally {
        network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [norm],
        });
    }
}

describe("Portara", function () {
  async function fixture() {
    // Prepare contracts.
    const escrow: IPoolEscrow = await ethers.getContractAt("IPoolEscrow", PORTARA.ESCROW);
    const steth: IERC20Upgradeable = await ethers.getContractAt("IERC20Upgradeable", PORTARA.STAKED_ETH);
    const rweth: IERC20Upgradeable = await ethers.getContractAt("IERC20Upgradeable", PORTARA.REWARD_ETH);
    const whitelist: IWhiteListManager = await ethers.getContractAt("IWhiteListManager", PORTARA.WHITELIST);

    // Prepare signer.
    const signer: Signer = await ethers.getSigners().then((xs: Signer[]): Signer => xs[0]);
    const signerAddress: string = await signer.getAddress();

    // Feed the ADMIN account with some ETH for gas fees.
    await signer.sendTransaction({
      to: PORTARA.ADMIN,
      value: ethers.parseEther("1"),
    });

    // Initially whitelist our main account.
    const tx: TransactionResponse = impersonate(PORTARA.ADMIN, async (admin: Signer): Promise<TransactionResponse> =>
      whitelist.connect(admin).updateWhiteList(signerAddress, true)
    );
    await expect(tx).not.to.be.reverted;

    return {
      escrow,
      steth,
      rweth,
      whitelist,

      signer,
      signerAddress,
    };
  }

  describe("Staking", function () {
    it("", async function () {
      const { steth, signer, signerAddress } = await loadFixture(fixture);
      const ten: bigint = ethers.parseEther("10");

      // Staking is as simple as sending ETH directly to the POOL contract.
      const tx: Promise<TransactionResponse> = signer.sendTransaction({
        to: PORTARA.POOL,
        value: ten,
      });

      // We expect the ETH to be transferred.
      await expect(tx).to.changeEtherBalances(
        [signerAddress, PORTARA.POOL],
        [-ten, ten],
      );

      // We expect the equivalent amount of StakedETH to be minted.
      await expect(tx).to.changeTokenBalances(
        steth,
        [signerAddress, PORTARA.POOL],
        [ten, 0],
      );
    });
  });

  describe("Unstaking", function () {
    it("", async function () {
      const { escrow, steth, rweth, signer, signerAddress } = await loadFixture(fixture);
      const ten: bigint = ethers.parseEther("10");

      // First let's stake.
      await signer.sendTransaction({
        to: PORTARA.POOL,
        value: ten,
      });

      // We need to approve the Escrow contract to spend our Staked
      // and Reward ETH.
      await expect(steth.approve(PORTARA.ESCROW, ten)).not.to.be.reverted;
      await expect(rweth.approve(PORTARA.ESCROW, 0)).not.to.be.reverted;

      // StakedETH is given to the PoolEscrow contract.
      const tx: Promise<TransactionResponse> = escrow.connect(signer).request(ten, 0);
      await expect(tx).to.changeTokenBalances(
        steth,
        [signerAddress, PORTARA.ESCROW],
        [-ten, ten],
      );

      // The equivalent amount of ETH is transferred back to us.
      await expect(tx).to.changeEtherBalances(
        [signerAddress, PORTARA.ESCROW],
        [ten, -ten],
      );
    });
  });
});
