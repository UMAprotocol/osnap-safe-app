// this pulls code from zodiac https://github.com/gnosis/zodiac-safe-app/blob/master/packages/app/src/services/index.ts#L599
import { ethers } from "ethers";
import { Interface } from "@ethersproject/abi";
import { BaseTransaction } from "@gnosis.pm/safe-apps-sdk";
import { abi as SafeAbi } from "@gnosis.pm/safe-deployments/dist/assets/v1.3.0/gnosis_safe_l2.json";
import { findContract } from "./contracts";

type JsonRpcProvider = ethers.providers.JsonRpcProvider;
import { deployAndSetUpModule, KnownContracts } from "@gnosis.pm/zodiac";

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
export const parseUnits = ethers.utils.parseUnits;
export const formatUnits = ethers.utils.formatUnits;

export function defaultRules(params: {
  snapshotUrl: string;
  votingQuorum: string;
  votingPeriodHours: string;
}) {
  return `I assert that this transaction proposal is valid according to the following rules: Proposals approved on Snapshot, as verified at ${params.snapshotUrl}, are valid as long as there is a minimum quorum of ${params.votingQuorum} and a minimum voting period of ${params.votingPeriodHours} hours and it does not appear that the Snapshot voting system is being exploited or is otherwise unavailable. The quorum and voting period are minimum requirements for a proposal to be valid. Quorum and voting period values set for a specific proposal in Snapshot should be used if they are more strict than the rules parameter. The explanation included with the on-chain proposal must be the unique IPFS identifier for the specific Snapshot proposal that was approved or a unique identifier for a proposal in an alternative voting system approved by DAO social consensus if Snapshot is being exploited or is otherwise unavailable.`;
}

export function enableModule(safeAddress: string, module: string) {
  return buildTransaction(new Interface(SafeAbi), safeAddress, "enableModule", [
    module,
  ]);
}

export interface OptimisticGovernorModuleParams {
  executor: string;
  owner: string;
  collateral: string;
  bond: string;
  rules: string;
  identifier: string;
  liveness: string;
}
export function deployOptimisticGovernorModule(
  provider: JsonRpcProvider,
  safeAddress: string,
  chainId: number,
  args: OptimisticGovernorModuleParams,
) {
  const { executor, collateral, bond, rules, identifier, liveness } = args;

  // only continue if we are within safe app environment
  if (executor !== safeAddress)
    throw new Error(`Executor address: ${executor} must match ${safeAddress}`);

  // make sure we have the collateral defined in contracts
  const { decimals } = findContract({ network: chainId, address: collateral });
  if (decimals === undefined)
    throw new Error(`Decimals missing for token address: ${collateral}`);

  const scaledBond = parseUnits(bond, decimals).toString();

  // this is a string name like "optimisticGovernor"
  const type = KnownContracts.OPTIMISTIC_GOVERNOR;

  const {
    transaction: daoModuleDeploymentTx,
    expectedModuleAddress: daoModuleExpectedAddress,
  } = deployAndSetUpModule(
    type,
    {
      types: ["address", "address", "uint256", "string", "bytes32", "uint64"],
      values: [executor, collateral, scaledBond, rules, identifier, liveness],
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
    safeAddress,
    daoModuleExpectedAddress,
  );
  daoModuleTransactions.push(enableDaoModuleTransaction);
  return daoModuleTransactions;
}
