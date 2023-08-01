// this pulls code from zodiac https://github.com/gnosis/zodiac-safe-app/blob/master/packages/app/src/services/index.ts#L599
import { ethers } from "ethers";
import { Interface } from "@ethersproject/abi";
import { BaseTransaction } from "@gnosis.pm/safe-apps-sdk";
import { abi as SafeAbi } from "@gnosis.pm/safe-deployments/dist/assets/v1.3.0/gnosis_safe_l2.json";

type JsonRpcProvider = ethers.providers.JsonRpcProvider;
import {
  deployAndSetUpModule,
  getModuleInstance,
  KnownContracts,
} from "@gnosis.pm/zodiac";

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
export function scaleBondDecimals(bond: string, isWeth: boolean): number {
  if (isWeth) {
    return Number(bond) * Math.pow(10, 18);
  } else {
    return Number(bond) * Math.pow(10, 6);
  }
}
export function deployOptimisticGovernorModule(
  provider: JsonRpcProvider,
  safeAddress: string,
  chainId: number,
  args: OptimisticGovernorModuleParams,
  isWeth: boolean,
) {
  const type = KnownContracts.OPTIMISTIC_GOVERNOR;
  const { executor, collateral, bond, rules, identifier, liveness } = args;
  const scaledBond = scaleBondDecimals(bond, isWeth).toString();
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
  if (executor !== safeAddress) {
    const delayModule = getModuleInstance(
      KnownContracts.DELAY,
      executor,
      provider,
    );
    const addModuleTransaction = buildTransaction(
      delayModule.interface,
      delayModule.address,
      "enableModule",
      [daoModuleExpectedAddress],
    );
    daoModuleTransactions.push(addModuleTransaction);
  } else {
    const enableDaoModuleTransaction = enableModule(
      safeAddress,
      daoModuleExpectedAddress,
    );
    daoModuleTransactions.push(enableDaoModuleTransaction);
  }
  return daoModuleTransactions;
}
