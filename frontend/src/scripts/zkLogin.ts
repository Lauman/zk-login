import { ethers } from "ethers";
import * as snarkjs from "snarkjs"
export async function zkLogin(password: string) {
  const expectedHash = await hashToNumber(password);


  if (!window.ethereum) throw new Error("No MetaMask detected");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();


  const contract = new ethers.Contract(
    import.meta.env.VITE_AUTH_ADDRESS,
    ["function login(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[2] calldata _pubSignals) external"],
    signer
  );
  const appId = import.meta.env.VITE_APP_ID
  const sessionId = await hashToNumber(getRamdom().toString())
  const { proof, publicSignals } = await snarkjs.groth16.fullProve({ userSecret: expectedHash, appId: appId, sessionId: sessionId }, "./zKLogin.wasm", "./zKLogin_final.zkey");

  const proofA = [proof.pi_a[0], proof.pi_a[1]];
  const proofB = [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]];
  const proofC = [proof.pi_c[0], proof.pi_c[1]];

  const tx = await contract.login(proofA, proofB, proofC, publicSignals);
  await tx.wait()

  return true;
}

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