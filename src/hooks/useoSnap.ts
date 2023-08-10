import { filterContracts } from "../libs";
import { useContractRead, type Address } from "wagmi";

export function useRules(params: { address: string; chainId: number }) {
  const { chainId, address } = params;
  // we use filter since this wont throw error in hooks, but it may return any number of contracts
  const ogContracts = filterContracts({
    chainId,
    name: "OptimisticGovernor",
  });
  const [ogContract] = ogContracts;

  return useContractRead({
    address: address as Address,
    abi: ogContract.abi,
    functionName: "rules",
    args: [ogContract.address as Address],
    // ensure we only run this hook if exactly one of each contract was returned
    enabled: ogContracts.length === 1,
  });
}
