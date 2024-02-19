import { NextRequest, NextResponse } from "next/server";
import { Client as SubgraphClient } from "@/libs/ogSubgraph";
import { isErrorWithMessage, isHttpError } from "@/types/guards";
import { getModuleConfig, isConfigStandard, parseParams } from "./utils";
import { Address } from "viem";

/**
 * Check if a space's deployed (on-chain) settings are supported by our bots.
 *
 * ### Query Params:
 * 1. address - the safe address.
 * 2. chainId - network for the safe.
 *
 * example url:
 *  https://osnap.uma.xyz/api/space-config?address=0xa690212421298fa7431c64f4b5ff8aa4e4a7e74e&chainId=137
 */
export async function GET(req: NextRequest) {
  try {
    const { chainId, address } = parseParams(req.nextUrl.searchParams);

    // get subgraph client for network
    const { getModuleAddress } = SubgraphClient(chainId);

    // use safe Address to find oSnap module address
    const moduleAddress = await getModuleAddress(address);

    if (!moduleAddress) {
      throw new Error("No module deployed for this safe", { cause: 404 });
    }

    const moduleConfig = await getModuleConfig(
      moduleAddress as Address,
      chainId,
    );

    const isStandard = isConfigStandard({ ...moduleConfig, chainId });

    return NextResponse.json(isStandard, { status: 200 });
  } catch (error) {
    // catch and rethrow with specific error codes, eg. in validation
    if (isHttpError(error)) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: error.cause,
        },
      );
    }

    return NextResponse.json(
      {
        error: isErrorWithMessage(error) ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}
