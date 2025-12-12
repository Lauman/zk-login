import { expect } from "chai";
import { network } from "hardhat";
import * as snarkjs from "snarkjs"

const { ethers } = await network.connect();

async function hashToNumber(str: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return parseInt(hashHex.substring(0, 10), 16);
}

function getRamdom() {
  return BigInt('0x' + crypto.getRandomValues(new Uint8Array(32))
  .reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), ''));
}

describe("ZKLoginAuth", function () {
  it("Generate proof an prove on chain", async function () {
    const groth16Verifier = await ethers.deployContract("Groth16Verifier");
    const zKLoginAuth = await ethers.deployContract("ZKLoginAuth", [groth16Verifier.getAddress()]);
    const sessionId = await hashToNumber(getRamdom().toString())
    const { proof, publicSignals } = await snarkjs.groth16.fullProve({ userSecret: "739791936675", appId: "739791936680", sessionId: sessionId }, "./test/zKLogin.wasm", "./test/zKLogin_final.zkey");

    const proofA = [proof.pi_a[0], proof.pi_a[1]];
    const proofB = [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]];
    const proofC = [proof.pi_c[0], proof.pi_c[1]];

    const tx = await zKLoginAuth.login(proofA, proofB, proofC, publicSignals);
    await tx.wait()
  });

});
