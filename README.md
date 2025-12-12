# 🚀 ZK-Login Authentication System

A privacy-preserving authentication system using Circom circuits, Groth16 proofs, and Solidity smart contracts. Users can authenticate without revealing private secrets by proving knowledge of a secret off-chain while the contract verifies the proof and prevents replay via nullifiers.

## Table of contents
- [Features](#features)
- [Overview](#overview)
  - [Circuit outputs](#circuit-outputs)
  - [Session randomness](#session-randomness)
  - [Solidity contract](#solidity-contract)
- [Repository structure](#repository-structure)
- [Setup & Installation](#setup--installation)
- [Compile circuits](#compile-circuits)
- [Deploy the smart contract](#deploy-the-smart-contract)
- [Login flow](#login-flow)
- [Contributing / Questions](#contributing--questions)

## ✨ Features
- ZK-based authentication without revealing secrets
- Replay protection using single-use nullifiers
- Persistent user identity via identityHash
- Session nonces (sessionId) generated off-chain
- Groth16 proof verification on-chain
- Easy integration with frontend (React + Vite)

## Overview

### Circuit outputs
The circuit produces two public outputs (exposed to the verifier):

- identityHash  
  - Derived from the user's private secret (e.g., Poseidon(userSecret)).  
  - Persistent: same for the same user.  
  - Acts as the user identifier for your dApp or backend.

- nullifier  
  - Derived from the userSecret, appId, and sessionId (e.g., Poseidon(userSecret, appId, sessionId)).  
  - Changes per login (sessionId) to prevent proof replay.  
  - Must be marked as "used" on-chain after successful verification.

Example logic inside the circuit:
```
identityHash = Poseidon(userSecret)
nullifier = Poseidon(userSecret, appId, sessionId)
```

### Session randomness
- sessionId is generated outside the circuit (frontend/backend) using cryptographic randomness.
- Examples:
  - Browser: `window.crypto.getRandomValues(...)`
  - Node.js: `crypto.randomBytes(32)`

The sessionId is passed as an input to the circuit before generating the proof.

### Solidity contract
The on-chain contract:
- Verifies Groth16 proofs
- Ensures nullifiers cannot be reused (prevents replay)
- Maintains mapping: `nullifier => used?`

This allows repeated authentications by the same identity while ensuring each login uses a unique nullifier.

## 📂 Repository structure
.
├── circuits/zk_login_circuits/circom
│   ├── ZKLogin.circom
│   ├── input.json
│   ├── public.json
│   ├── compile_circuit.sh
│   ├── copy_circuits.sh
│   └── powersOfTau28_hez_final_12.ptau
├── contracts/
│   ├── Groth16Verifier.sol
│   └── ZKLoginAuth.sol
├── frontend/
│   ├── public/
│   └── src/
├── test/
│   └── ZKLoginAuth.test.ts
└── README.md

## 🛠️ Setup & Installation
Requirements:
- Node.js ≥ 22
- pnpm (or another package manager)
- Circom ≥ 2.x
- snarkjs ≥ 0.7.x
- Hardhat ≥ 3 (optional, for contract deployment)

Install dependencies:
```bash
pnpm install
```

## 🔧 Compile circuits
To compile the circom circuit(s):
```bash
pnpm run compile-circuits
```
(See `circuits/zk_login_circuits/compile_circuit.sh` for details.)

## 📤 Deploy the smart contract
Using Hardhat (example):
```bash
pnpm hardhat ignition deploy ignition/modules/ZKLoginAuth.ts --network localhost
```
Adjust the command/scripts to match your deployment configuration and network.

## 🔗 Login flow (high-level)
1. Frontend generates a cryptographic random `sessionId`.
2. User has or derives a `userSecret`.
3. Circuit computes `identityHash` and `nullifier` (using the `sessionId`).
4. Frontend/backend creates a Groth16 proof for the circuit.
5. User submits the proof and public outputs to the smart contract.
6. Contract:
   - Verifies the proof
   - Checks that the `nullifier` has not been used before
   - Marks the `nullifier` as used on success
7. On the backend/dApp, `identityHash` represents the authenticated userId.

## 💬 Contributing / Questions
Feel free to open issues or submit pull requests. If you'd like me to push this reordered README to the repository or create a PR, tell me which branch to use (or confirm `master`/`main`) and I'll prepare the change.
