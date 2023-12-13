import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import * as common from "../src/common";

task("list-fee-recipients", "List protocol fee recipients")
    .setAction(async (
        _args: {},
        _hre: HardhatRuntimeEnvironment,
    ): Promise<void> => {
        const proofs: any = await common.fetchProofs();
        Object.keys(proofs).forEach((key: string) => console.log(key));
    });
