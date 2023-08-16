// this pulls code from zodiac https://github.com/gnosis/zodiac-safe-app/blob/master/packages/app/src/services/index.ts#L599
import { ethers } from "ethers";
import { Interface } from "@ethersproject/abi";
import { BaseTransaction } from "@gnosis.pm/safe-apps-sdk";
import SafeAbi from "@gnosis.pm/safe-deployments/dist/assets/v1.3.0/gnosis_safe_l2.json";
import { findContract, AddressOne } from "./contracts";
import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk";

export const safeSdk = new SafeAppsSDK();

type JsonRpcProvider = ethers.providers.JsonRpcProvider;
import { deployAndSetUpCustomModule } from "@gnosis.pm/zodiac";

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
  spaceUrl: string;
  quorum: string;
  challengePeriodText: string;
}) {
  return `I assert that this transaction proposal is valid according to the following rules: Proposals approved on Snapshot, as verified at ${params.spaceUrl}, are valid as long as there is a minimum quorum of ${params.quorum} and a minimum voting period of ${params.challengePeriodText} and it does not appear that the Snapshot voting system is being exploited or is otherwise unavailable. The quorum and voting period are minimum requirements for a proposal to be valid. Quorum and voting period values set for a specific proposal in Snapshot should be used if they are more strict than the rules parameter. The explanation included with the on-chain proposal must be the unique IPFS identifier for the specific Snapshot proposal that was approved or a unique identifier for a proposal in an alternative voting system approved by DAO social consensus if Snapshot is being exploited or is otherwise unavailable.`;
}

// https://github.com/gnosis/zodiac-safe-app/blob/0dfeac33b8e95af566c7ff7b1d77017071219599/packages/app/src/services/index.ts#L477
export function disableModule(safeAddress: string, module: string) {
  const prevModule = AddressOne;
  const args = [prevModule, module];
  return buildTransaction(
    new Interface(SafeAbi.abi),
    safeAddress,
    "disableModule",
    args,
  );
}

export function enableModule(safeAddress: string, module: string) {
  return buildTransaction(
    new Interface(SafeAbi.abi),
    safeAddress,
    "enableModule",
    [module],
  );
}

export type OgDeploymentTxsParams = {
  provider: JsonRpcProvider;
  chainId: number;
  executor: string;
  collateral: string;
  bond: string;
  identifier: string;
  liveness: string;
  spaceUrl: string;
  quorum: string;
  challengePeriodText: string;
};
export function ogDeploymentTxs(params: OgDeploymentTxsParams) {
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
    challengePeriodText,
  } = params;

  // make sure we have the collateral defined in contracts
  const { decimals } = findContract({ chainId, address: collateral });
  if (decimals === undefined)
    throw new Error(`Decimals missing for token address: ${collateral}`);

  const ogContract = findContract({
    name: "OptimisticGovernor",
    chainId,
  });
  if (ogContract.abi === undefined)
    throw new Error(`Unable to find abi for Optimistic Governor`);

  const bondWei = parseUnits(bond, decimals).toString();
  const rules = defaultRules({ spaceUrl, quorum, challengePeriodText });

  const {
    transaction: daoModuleDeploymentTx,
    expectedModuleAddress: daoModuleExpectedAddress,
  } = deployAndSetUpCustomModule(
    ogContract.address,
    ogContract.abi,
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
