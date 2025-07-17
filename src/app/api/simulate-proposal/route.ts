import { NextRequest, NextResponse } from "next/server";
import { getAddress } from "@uma/contracts-node";
import { handleApiError, gnosisSafe, validateApiRequest } from "../_utils";
import z from "zod";
import { simulateTenderlyTx, TenderlySimulationParams } from "./tenderly";
import { AbiCoder, keccak256, Interface } from "ethers";
import { padHex, toHex } from "viem";
import { OptimisticGovernorAbi } from "../../../libs/abis";

const osnapPluginData = z.object({
  safe: gnosisSafe,
});

export async function POST(req: NextRequest) {
  try {
    const { safe } = validateApiRequest(osnapPluginData, await req.json());
    const ooAddress = await getAddress(
      "OptimisticOracleV3",
      Number(safe.network),
    );
    const simParams = mapOsnapSafeToTenderlySim(safe, ooAddress);
    const simResponse = await simulateTenderlyTx(simParams);

    return NextResponse.json(simResponse, {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return handleApiError(e);
  }
}

// Creates Tenderly simulation parameters for oSnap proposal execution with required state overrides:
// - OptimisticGovernor knows of proposalHash pointing to non-zero asserionId in the assertionIds mapping;
// - OptimisticOracleV3 has the Assertion with the above assertionId marked as settled.
function mapOsnapSafeToTenderlySim(
  safe: z.infer<typeof gnosisSafe>,
  ooAddress: string,
): TenderlySimulationParams {
  const transactions = safe.transactions.map((tx) => {
    const [to, operation, value, data] = tx.formatted;
    return { to, operation, data, value };
  });

  // Calculate proposalHash from proposed transaction contents.
  const ogInterface = new Interface(OptimisticGovernorAbi);
  const proposalHash = keccak256(
    ogInterface.encodeFunctionData("executeProposal", [transactions]),
  );

  // assertionIds mapping pointer is at slot 110 in the OptimisticGovernor contract.
  const assertionIdsSlot = keccak256(
    new AbiCoder().encode(["bytes32", "uint256"], [proposalHash, 110]),
  );

  // assertionId needs to be the same non-zero value in both OptimisticGovernor and OptimisticOracleV3.
  const assertionId = "0x1";

  // assertions mapping pointer is at slot 4 in the OptimisticOracleV3 contract. We need to override settled property
  // that is 28 bytes offset at slot 2 within the Assertion struct.
  const assertionSettledSlot =
    "0x" +
    (
      BigInt(
        keccak256(
          new AbiCoder().encode(
            ["bytes32", "uint256"],
            [
              padHex(assertionId, {
                size: 32,
              }),
              4,
            ],
          ),
        ),
      ) + 2n
    ).toString(16);
  const assertionSettledOffset = 28;
  const assertionSettledValue = "0x1"; // Represents settled as true.

  return {
    chainId: Number(safe.network),
    to: safe.moduleAddress,
    input: ogInterface.encodeFunctionData("executeProposal", [transactions]),
    stateOverrides: [
      {
        address: safe.moduleAddress,
        slot: assertionIdsSlot,
        value: assertionId,
      },
      {
        address: ooAddress,
        slot: assertionSettledSlot,
        offset: assertionSettledOffset,
        value: assertionSettledValue,
      },
    ],
  };
}
