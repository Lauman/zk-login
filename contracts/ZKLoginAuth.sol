// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./Groth16Verifier.sol";
import "hardhat/console.sol";

contract ZKLoginAuth {
    Groth16Verifier public verifier;
    mapping(bytes32 => bool) public usedNullifiers;

    constructor(address _verifier) {
        verifier = Groth16Verifier(_verifier);
    }

    function login(
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[2] calldata _pubSignals
    ) external {
        require(
            verifier.verifyProof(_pA, _pB, _pC, _pubSignals),
            "Invalid proof"
        );
        bytes32 nullifier = bytes32(_pubSignals[0]);

        require(!usedNullifiers[nullifier], "Nullifier already used");

        usedNullifiers[nullifier] = true;
    }
}
