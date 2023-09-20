import "@nomicfoundation/hardhat-ethers";
import { ethers, network } from "hardhat";
import { Signer, TransactionResponse } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";

import { IERC20Upgradeable, IPoolEscrow, IWhiteListManager } from "../typechain-types";

import contracts from "../src/contracts.json";

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
    const escrow: IPoolEscrow = await ethers.getContractAt("IPoolEscrow", contracts.escrow);
    const steth: IERC20Upgradeable = await ethers.getContractAt("IERC20Upgradeable", contracts.stakedEth);
    const rweth: IERC20Upgradeable = await ethers.getContractAt("IERC20Upgradeable", contracts.rewardEth);
    const whitelist: IWhiteListManager = await ethers.getContractAt("IWhiteListManager", contracts.whitelist);

    // Prepare signer.
    const signer: Signer = await ethers.getSigners().then((xs: Signer[]): Signer => xs[0]);
    const signerAddress: string = await signer.getAddress();

    // Feed the ADMIN account with some ETH for gas fees.
    await signer.sendTransaction({
      to: contracts.admin,
      value: ethers.parseEther("1"),
    });

    // Initially whitelist our main account.
    const tx: TransactionResponse = impersonate(contracts.admin, async (admin: Signer): Promise<TransactionResponse> =>
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
        to: contracts.pool,
        value: ten,
      });

      // We expect the ETH to be transferred.
      await expect(tx).to.changeEtherBalances(
        [signerAddress, contracts.pool],
        [-ten, ten],
      );

      // We expect the equivalent amount of StakedETH to be minted.
      await expect(tx).to.changeTokenBalances(
        steth,
        [signerAddress, contracts.pool],
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
        to: contracts.pool,
        value: ten,
      });

      // We need to approve the Escrow contract to spend our Staked
      // and Reward ETH.
      await expect(steth.approve(contracts.escrow, ten)).not.to.be.reverted;
      await expect(rweth.approve(contracts.escrow, 0)).not.to.be.reverted;

      // StakedETH is given to the PoolEscrow contract.
      const tx: Promise<TransactionResponse> = escrow.connect(signer).request(ten, 0);
      await expect(tx).to.changeTokenBalances(
        steth,
        [signerAddress, contracts.escrow],
        [-ten, ten],
      );

      // The equivalent amount of ETH is transferred back to us.
      await expect(tx).to.changeEtherBalances(
        [signerAddress, contracts.escrow],
        [ten, -ten],
      );
    });
  });
});
