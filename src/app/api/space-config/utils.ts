import {
  OptimisticGovernorAbi,
  contractDataList,
  findContract,
  getPublicClient,
} from "@/libs";
import { Address, formatUnits, isAddress, isAddressEqual } from "viem";

const BOND_TOKEN_NAME = "WETH";
const BOND_AMOUNT = 2;

function rulesMatch(rules: string): boolean {
  // This is based on the rules regex from protocol
  // https://github.com/UMAprotocol/protocol/blob/bc7aef9dc60190909036e1418647f429f3702096/packages/monitor-v2/src/monitor-og/SnapshotVerification.ts#L274

  const regex =
    /^I assert that this transaction proposal is valid according to the following rules: Proposals approved on Snapshot, as verified at https:\/\/snapshot\.org\/#\/([a-zA-Z0-9-.]+)\/?, are valid as long as there is a minimum quorum of (\d+) and a minimum voting period of (\d+) hours and it does not appear that the Snapshot voting system is being exploited or is otherwise unavailable\. The quorum and voting period are minimum requirements for a proposal to be valid\. Quorum and voting period values set for a specific proposal in Snapshot should be used if they are more strict than the rules parameter\. The explanation included with the on-chain proposal must be the unique IPFS identifier for the specific Snapshot proposal that was approved or a unique identifier for a proposal in an alternative voting system approved by DAO social consensus if Snapshot is being exploited or is otherwise unavailable.$/;

  return regex.test(rules);
}

export function parseParams(params: URLSearchParams) {
  const address = params.get("address");
  const chainId = params.get("chainId");
  const supportedNetworks = contractDataList.map((chain) => chain.chainId);

  if (!chainId) {
    throw new Error("no chainId in query", { cause: 400 });
  }
  if (!address) {
    throw new Error("no address in query", { cause: 400 });
  }

  if (!isAddress(address)) {
    throw new Error("Invalid address in query", { cause: 400 });
  }
  if (!supportedNetworks.includes(parseInt(chainId))) {
    throw new Error("Network not supported", { cause: 400 });
  }

  return {
    chainId: parseInt(chainId),
    address: address,
  };
}

export async function getModuleConfig(moduleAddress: Address, chainId: number) {
  const provider = getPublicClient(chainId);

  if (!provider) {
    throw new Error("Network not supported");
  }

  const config = {
    address: moduleAddress,
    abi: OptimisticGovernorAbi,
  };

  const [rules, bondAmount, collateral] = await Promise.all([
    provider.readContract({
      ...config,
      functionName: "rules",
    }),
    provider.readContract({
      ...config,
      functionName: "bondAmount",
    }),
    provider.readContract({
      ...config,
      functionName: "collateral",
    }),
  ]);

  return {
    rules,
    bondAmount,
    collateral,
  };
}

export type SpaceConfigResponse =
  | {
      automaticExecution: true;
    }
  | {
      automaticExecution: false;
      rules: boolean;
      bondToken: boolean;
      bondAmount: boolean;
    };

export function isConfigStandard(params: {
  rules: string;
  bondAmount: bigint;
  collateral: Address;
  chainId: number;
}): SpaceConfigResponse {
  const rulesStandard = rulesMatch(params.rules);

  // find weth for network
  const weth = findContract({
    chainId: params.chainId,
    name: BOND_TOKEN_NAME,
  });
  // check if address is correct
  const isWeth = isAddressEqual(params.collateral, weth.address);

  // check if amount is correct

  const isCorrectAmount =
    formatUnits(params.bondAmount, weth.decimals ?? 18) ===
    BOND_AMOUNT.toString();

  if (rulesStandard && isWeth && isCorrectAmount) {
    return {
      automaticExecution: true,
    };
  }

  return {
    automaticExecution: false,
    rules: rulesStandard,
    bondToken: isWeth,
    bondAmount: isCorrectAmount,
  };
}
