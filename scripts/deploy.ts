import { network } from "hardhat";

const { ethers, networkName } = await network.connect();

console.log(`Deploying Counter to ${networkName}...`);

const ZKTranscriptLib = await ethers.deployContract("ZKTranscriptLib");
await ZKTranscriptLib.waitForDeployment();

const ZKLoginVerifier = await ethers.getContractFactory("ZKLoginVerifier", {
    libraries: {
        ZKTranscriptLib: ZKTranscriptLib.target,
    },
});


console.log("Waiting for the deployment tx to confirm");
const myContract = await ZKLoginVerifier.deploy();
await myContract.waitForDeployment();


console.log("Counter address:", await myContract.getAddress());


console.log("Deployment successful!");