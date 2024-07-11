import { filterContracts, OptimisticOracleV3Abi } from "../libs";
import { useContractRead, useNetwork } from "wagmi";

export function useGetMinimumBond(params: { tokenSymbol: string }) {
  const { chain } = useNetwork();
  const { tokenSymbol } = params;

  // we use filter since this wont throw error in hooks, but it may return any number of contracts
  const oracleContracts = filterContracts({
    chainId: chain?.id,
    name: "OptimisticOracleV3",
  });

  const tokenContracts = filterContracts({
    chainId: chain?.id,
    name: tokenSymbol,
  });
  // just take the first contract
  const [oracleContract] = oracleContracts;
  const [tokenContract] = tokenContracts;

  return useContractRead({
    chainId: chain?.id,
    address: oracleContract.address,
    abi: OptimisticOracleV3Abi,
    functionName: "getMinimumBond",
    args: [tokenContract.address],
    // ensure we only run this hook if exactly one of each contract was returned
    enabled: oracleContracts.length === 1 && tokenContracts.length === 1,
  });
}
