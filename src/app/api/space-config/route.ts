import { NextRequest, NextResponse } from "next/server";
import { Client as SubgraphClient } from "@/libs/ogSubgraph";
import {
  getModuleConfig,
  isConfigStandard,
  isOriginAllowed,
  parseParams,
} from "./utils";
import { Address } from "viem";
import { getInfuraUrl } from "@/libs/contracts";
import { HttpError, handleApiError } from "../_utils";

// Mark this route as dynamic since it accesses headers
export const dynamic = "force-dynamic";

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
    const requester = req.headers.get("origin") ?? "";
    const { chainId, address } = parseParams(req.nextUrl.searchParams);

    // Check if the origin is allowed early to prevent unnecessary async code execution
    if (!isOriginAllowed(requester)) {
      throw new HttpError({ statusCode: 403, msg: "Origin not allowed" });
    }

    // get subgraph client for network
    const { getModuleAddress } = SubgraphClient(chainId);

    // use safe Address to find oSnap module address
    const moduleAddress = await getModuleAddress(address);

    if (!moduleAddress) {
      throw new HttpError({
        statusCode: 404,
        msg: "No module deployed for this safe",
      });
    }

    const moduleConfig = await getModuleConfig(
      moduleAddress as Address,
      chainId,
      getInfuraUrl(chainId, process.env.INFURA_KEY),
    );

    const isStandard = isConfigStandard({ ...moduleConfig, chainId });

    return NextResponse.json(isStandard, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": requester,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "604800", // Cache the preflight response for 1 week
        "Cache-Control": "public, max-age=0, s-maxage=600", // 10 min
      },
    });
  } catch (error) {
    console.error("Error getting space deployment", error);
    return handleApiError(error);
  }
}
