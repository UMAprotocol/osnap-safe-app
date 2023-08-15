import assert from "assert";
import { filterContracts } from "../libs";
import useSwr from "swr";
import { useAccount, useNetwork, useContractRead, type Address } from "wagmi";
import { Client } from "../libs/ogSubgraph";

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

export function useOSnap() {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const enabled = useSwr(`/enabled/${address}/${chain?.id}`, () => {
    assert(chain?.id, "Requires chainid");
    assert(address, "Requires safe address");
    return Client(chain.id).isEnabled(address);
  });
  const moduleAddress = useSwr(`/moduleAddress/${address}/${chain?.id}`, () => {
    assert(chain?.id, "Requires chainid");
    assert(address, "Requires safe address");
    return Client(chain.id).getModuleAddress(address);
  });
  return {
    chain,
    address,
    enabled,
    moduleAddress,
  };
}
