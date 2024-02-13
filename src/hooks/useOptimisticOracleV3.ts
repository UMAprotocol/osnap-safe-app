import { filterContracts, OptimisticOracleV3Abi } from "../libs";
import { useReadContract } from "wagmi";

export function useGetMinimumBond(params: {
  chainId: number;
  tokenSymbol: string;
}) {
  const { chainId, tokenSymbol } = params;

  // we use filter since this wont throw error in hooks, but it may return any number of contracts
  const oracleContracts = filterContracts({
    chainId,
    name: "OptimisticOracleV3",
  });
  const tokenContracts = filterContracts({ chainId, name: tokenSymbol });
  // just take the first contract
  const [oracleContract] = oracleContracts;
  const [tokenContract] = tokenContracts;

  return useReadContract({
    address: oracleContract.address,
    abi: OptimisticOracleV3Abi,
    functionName: "getMinimumBond",
    args: [tokenContract.address],
    // ensure we only run this hook if exactly one of each contract was returned
    query: {
      enabled: oracleContracts.length === 1 && tokenContracts.length === 1,
    },
  });
}
