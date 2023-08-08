import { filterContracts } from "../libs";
import { useContractRead, type Address } from "wagmi";

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

  return useContractRead({
    address: oracleContract.address as Address,
    abi: oracleContract.abi,
    functionName: "getMinimumBond",
    args: [tokenContract.address as Address],
    // ensure we only run this hook if exactly one of each contract was returned
    enabled: oracleContracts.length === 1 && tokenContracts.length === 1,
  });
}
