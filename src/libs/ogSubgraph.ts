import assert from "assert";
import request, { gql } from "graphql-request";
import { findContract } from "./contracts";
import { ethers } from "ethers";

export function Client(chainId: number) {
  const ogInfo = findContract({ chainId, name: "OptimisticGovernor" });
  assert(ogInfo.subgraph, `No subgraph defined for OG on chainId ${chainId}`);
  const subgraph = ogInfo.subgraph;

  async function getModuleAddress(
    safeAddress: string,
  ): Promise<string | undefined> {
    type Response = {
      safe: { optimisticGovernor: { id: string } } | null;
    };
    const gqlQuery = gql`
      query getModuleAddress {
        safe(id:"${safeAddress.toLowerCase()}"){
          optimisticGovernor {
            id
          }
        }
      }
    `;
    const response = await request<Response>(subgraph, gqlQuery);
    // TODO: might be better to throw with descriptive message here
    if (!response.safe) {
      throw new Error("No module deployed on this safe", { cause: 404 });
    }
    return ethers.utils.getAddress(response.safe.optimisticGovernor.id);
  }
  async function isEnabled(safeAddress: string): Promise<boolean | undefined> {
    type Response = {
      safe: { isOptimisticGovernorEnabled: boolean } | null;
    };
    const gqlQuery = gql`
      query isOSnapEnabled {
        safe(id:"${safeAddress.toLowerCase()}"){
          isOptimisticGovernorEnabled
        }
      }
    `;
    const response = await request<Response>(subgraph, gqlQuery);
    if (!response.safe) {
      return undefined;
    }
    return response.safe.isOptimisticGovernorEnabled;
  }

  return {
    isEnabled,
    getModuleAddress,
  };
}
