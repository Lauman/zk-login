import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const Groth16Verifier =  buildModule("Groth16Verifier", (m) => {
  const groth16Verifier = m.contract("Groth16Verifier", []);

  return { groth16Verifier };
});

export default buildModule("ZKLoginAuthModule", (m) => {
  const { groth16Verifier } = m.useModule(Groth16Verifier);

  const zkLoginAuth = m.contract("ZKLoginAuth", [groth16Verifier]);

  return { zkLoginAuth };
});
