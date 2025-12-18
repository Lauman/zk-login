import { describe, expect, it } from "vitest";


it('can assert that a snippet execs ok',async () => {
    const userSecret = "739791936675";
    const appId = "739791936680";
    const sessionId = "233517041190";
    await expect({
        source:`
        pragma circom 2.0.0;
        include "poseidon.circom";
        template Test() {
        // --- Inputs ---
        signal input userSecret;
        signal input appId;
        signal input sessionId;

        // --- Output ---
        signal output nullifier;
        signal output identityHash;

        // identityHash = Poseidon(userSecret)
        component idPoseidon = Poseidon(1);
        idPoseidon.inputs[0] <== userSecret;
        identityHash <== idPoseidon.out;

        // nullifier = Poseidon(userSecret, appId, sessionId)
        // cambia por cada sesión
        component nPoseidon = Poseidon(3);
        nPoseidon.inputs[0] <== userSecret;
        nPoseidon.inputs[1] <== appId;
        nPoseidon.inputs[2] <== sessionId;

        nullifier <== nPoseidon.out;
            }
        component main = Test();
    `,
    signals: {
        userSecret,
        appId,
        sessionId
      } }

).toCircomExecOk();
});
