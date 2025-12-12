🚀 ZK-Login Authentication System

A privacy-preserving authentication system built with Circom, Groth16 proofs, and Solidity, using:

identityHash → persistent user identity

nullifier → single-use anti-replay value

sessionId → unique login session randomness

This project demonstrates how users can authenticate without revealing private information, using zero-knowledge proofs.

✨ Features

ZK-based authentication without revealing secrets

Replay protection using unique nullifiers

Persistent user identity via identityHash

Secure session nonces (sessionId) generated off-chain

Groth16 proof verification on-chain

Easy integration with frontend (React/Vite)

📦 Project Overview
🔐 Zero-Knowledge Circuit (Circom)

The circuit produces two public outputs:

identityHash

Derived only from the user’s private secret

Always the same for the same user

Used to identify the user in your dApp or backend

nullifier

Derived from:

userSecret

appId

sessionId (random per login)

Prevents proof replay

Must be marked as "used" on-chain

Example logic in the circuit:

identityHash = Poseidon(userSecret)
nullifier = Poseidon(userSecret, appId, sessionId)

📝 Session Randomness

sessionId is generated outside the circuit (frontend/backend) using cryptographic randomness:

Browser:

window.crypto.getRandomValues(...)


Node.js:

crypto.randomBytes(32)


The value is passed as an input to the circuit before creating the proof.

🧾 Solidity Contract

The smart contract:

Verifies Groth16 proofs

Ensures nullifiers cannot be reused


Mapping structure:

nullifier → used?


This allows a user to authenticate multiple times while ensuring each login session uses a unique nullifier.

📂 Repository Structure
.
├── circuits/zk_login_circuits/circom
│   ├── ZKLogin.circom
│   ├── input.json
│   ├── public.json
│   ├── compile_circuit.sh
│   ├── copy_circuits.sh
│   └── powersOfTau28_hez_final_12.ptau
│
├── contracts/
│   ├── Groth16Verifier.sol
│   └── ZKLoginAuth.sol
│
├── frontend/
│   ├── public/
│   └── src/
│   
│
├── test/
│   └── ZKLoginAuth.test.ts
│
└── README.md

🛠️ Setup & Installation
1. Install Dependencies
pnpm install


You'll need:

Node.js ≥ 22

Circom ≥ 2.0.0

SnarkJS ≥ 0.7.0

Hardhat ≥ 3 (optional for contract deployment)

🔧 Compile Circuit (If you want to change)

Run pnpm run compile-circuits

📤 Deploy the Smart Contract

Using Hardhat:

pnpm hardhat ignition deploy ignition/modules/ZKLoginAuth.ts --network localhost

🔗 Login Flow (How It Works)

Frontend generates a sessionId (random)

User provides or derives a secret (userSecret)

Circuit computes:

identityHash

nullifier

User submits Groth16 proof to smart contract

Contract:

verifies proof

checks nullifier unused


On the backend/dapp:

identityHash becomes the userId.

💬 Questions / Improvements?

Feel free to open issues or submit pull requests.