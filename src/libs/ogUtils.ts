// this pulls code from zodiac https://github.com/gnosis/zodiac-safe-app/blob/master/packages/app/src/services/index.ts#L599
import { JsonRpcProvider, ethers } from "ethers";
import { Interface } from "@ethersproject/abi";
import { BaseTransaction } from "@gnosis.pm/safe-apps-sdk";
import { findContract, AddressOne, type Address } from "./contracts";
import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk";
import { OptimisticGovernorAbi, SafeAbi } from "./abis";

export const safeSdk = new SafeAppsSDK();

import { deployAndSetUpCustomModule } from "@reinis_frp/zodiac";

export const buildTransaction = (
  iface: Interface,
  to: string,
  method: string,
  params: unknown[],
  value?: string,
) => {
  return {
    to,
    data: iface.encodeFunctionData(method, params),
    value: value ?? "0",
  };
};

export function defaultRules(params: {
  spaceUrl: string;
  quorum: string;
  votingPeriodHours: string;
}) {
  return `I assert that this transaction proposal is valid according to the following rules: Proposals approved on Snapshot, as verified at ${params.spaceUrl}, are valid as long as there is a minimum quorum of ${params.quorum} and a minimum voting period of ${params.votingPeriodHours} hours and it does not appear that the Snapshot voting system is being exploited or is otherwise unavailable. The quorum and voting period are minimum requirements for a proposal to be valid. Quorum and voting period values set for a specific proposal in Snapshot should be used if they are more strict than the rules parameter. The explanation included with the on-chain proposal must be the unique IPFS identifier for the specific Snapshot proposal that was approved or a unique identifier for a proposal in an alternative voting system approved by DAO social consensus if Snapshot is being exploited or is otherwise unavailable.`;
}
export function extractParamsFromRules(rules: string): {
  spaceUrl: string | undefined;
  quorum: string | undefined;
  votingPeriodHours: string | undefined;
} {
  const spaceUrlRegex = /verified at (.*?),/;
  const quorumRegex = /minimum quorum of (.*?) and/;
  const votingPeriodRegex = /minimum voting period of (.*?) hours/;

  const spaceUrlMatch = rules.match(spaceUrlRegex);
  const quorumMatch = rules.match(quorumRegex);
  const votingPeriodMatch = rules.match(votingPeriodRegex);

  return {
    spaceUrl: spaceUrlMatch ? spaceUrlMatch[1] : undefined,
    quorum: quorumMatch ? quorumMatch[1] : undefined,
    votingPeriodHours: votingPeriodMatch ? votingPeriodMatch[1] : undefined,
  };
}

// https://github.com/gnosis/zodiac-safe-app/blob/0dfeac33b8e95af566c7ff7b1d77017071219599/packages/app/src/services/index.ts#L477
export function disableModule(safeAddress: string, module: string) {
  const prevModule = AddressOne;
  const args = [prevModule, module];
  return buildTransaction(
    new Interface(SafeAbi),
    safeAddress,
    "disableModule",
    args,
  );
}

export function enableModule(safeAddress: string, module: string) {
  return buildTransaction(new Interface(SafeAbi), safeAddress, "enableModule", [
    module,
  ]);
}

export type OgDeploymentTxsParams = {
  provider: JsonRpcProvider;
  chainId: number;
  executor: string;
  collateral: Address;
  bond: string;
  identifier: string;
  liveness: string;
  spaceUrl: string;
  quorum: string;
  votingPeriodHours: string;
};
export async function ogDeploymentTxs(params: OgDeploymentTxsParams) {
  const {
    provider,
    chainId,
    executor,
    collateral,
    bond,
    identifier,
    liveness,
    spaceUrl,
    quorum,
    votingPeriodHours,
  } = params;

  // make sure we have the collateral defined in contracts
  const { decimals } = findContract({ chainId, address: collateral });
  if (decimals === undefined)
    throw new Error(`Decimals missing for token address: ${collateral}`);

  const ogContract = findContract({
    name: "OptimisticGovernor",
    chainId,
  });

  const bondWei = ethers.parseUnits(bond, decimals).toString();
  const rules = defaultRules({ spaceUrl, quorum, votingPeriodHours });

  const {
    transaction: daoModuleDeploymentTx,
    expectedModuleAddress: daoModuleExpectedAddress,
  } = await deployAndSetUpCustomModule(
    ogContract.address,
    OptimisticGovernorAbi,
    {
      types: ["address", "address", "uint256", "string", "bytes32", "uint64"],
      values: [executor, collateral, bondWei, rules, identifier, liveness],
    },
    provider,
    chainId,
    Date.now().toString(),
  );
  const daoModuleTransactions: BaseTransaction[] = [
    {
      ...daoModuleDeploymentTx,
      value: daoModuleDeploymentTx.value.toString(),
    },
  ];
  const enableDaoModuleTransaction = enableModule(
    executor,
    daoModuleExpectedAddress,
  );
  daoModuleTransactions.push(enableDaoModuleTransaction);
  return daoModuleTransactions;
}

export function sleep(ms = 0) {
  return new Promise((res) => setTimeout(res, ms));
}
