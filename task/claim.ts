import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { IMerkleDistributor } from "../typechain-types";

import * as common from "../src/common";
import contracts from "../src/contracts.json";

interface Arguments {
    recipient: string,
};

task("claim", "Claim protocol fees")
    .addPositionalParam("recipient", "StakedETH to withdraw", contracts.admin)
    .setAction(async (
        args: Arguments,
        hre: HardhatRuntimeEnvironment,
    ): Promise<void> => {
        console.log(`[I] Claiming fees for ${args.recipient}...`);

        const distributor: IMerkleDistributor = await hre.ethers.getContractAt("IMerkleDistributor", contracts.merkleDistributor);
        console.log("[I] MerkleDistributor.merkleRoot:", await distributor.merkleRoot());

        const proofs: any = await common.fetchProofs();
        console.log("[I] Proofs:");
        console.log(proofs);

        const tx = await distributor.claim(
            proofs[args.recipient].index,
            args.recipient,
            proofs[args.recipient].tokens,
            proofs[args.recipient].values,
            proofs[args.recipient].proof
        );
        console.log(tx);
    });
