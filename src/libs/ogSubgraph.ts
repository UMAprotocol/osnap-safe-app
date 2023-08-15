import assert from "assert";
import request, { gql } from "graphql-request";
import { findContract } from "./contracts";
import { ethers } from "ethers";

export function Client(chainId: number) {
  const ogInfo = findContract({ chainId, name: "OptimisticGovernor" });
  assert(ogInfo.subgraph, `No subgraph defined for OG on chainId ${chainId}`);
  const subgraph = ogInfo.subgraph;

  async function getModuleAddress(safeAddress: string): Promise<string> {
    type Response = {
      safe: { optimisticGovernor: { id: string } };
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
    return ethers.utils.getAddress(response.safe.optimisticGovernor.id);
  }
  async function isEnabled(safeAddress: string): Promise<boolean> {
    type Response = {
      safe: { isOptimisticGovernorEnabled: boolean };
    };
    const gqlQuery = gql`
      query isOSnapEnabled {
        safe(id:"${safeAddress.toLowerCase()}"){
          isOptimisticGovernorEnabled
        }
      }
    `;
    const response = await request<Response>(subgraph, gqlQuery);
    return response.safe.isOptimisticGovernorEnabled;
  }

  return {
    isEnabled,
    getModuleAddress,
  };
}
