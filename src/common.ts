const AWS_BUCKET_NAME: string = "portara-mainnet";
const AWS_REGION: string = "eu-west-1";
const VOTE_URL: string = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/0x5EFF1c61d6941a170549d9aB3a276e55A3F5Cebf/distributor-vote.json`;

function check(response: Response) {
    if (!response.ok) {
        console.log("[E] Failed to fetch:", response.url);
        console.log("\tstatus:", response.status);
        console.log("\tstatusText:", response.statusText);
        process.exit(1);
    }
}

export async function fetchProofs(): Promise<any> {
    const voteResponse: Response = await fetch(VOTE_URL);
    check(voteResponse);

    const body: any = await voteResponse.json();
    if (!Object.prototype.hasOwnProperty.call(body, "merkle_proofs")) {
        console.log("[E] Response provides no merkle_proofs:");
        console.log(body);
        return;
    }

    const proofsIID: string = "" + body["merkle_proofs"];
    // const proofsIID: string = "/ipfs/Qma5Fg57K29obKxtEW6upEd2qsDi5hkMJEK7g1D4yDY8dt";
    const proofsURL: string = `https://ipfs.io${proofsIID}`;
    const proofsResponse: Response = await fetch(proofsURL);
    check(proofsResponse);

    const proofs: any = await proofsResponse.json();
    return proofs;
}
