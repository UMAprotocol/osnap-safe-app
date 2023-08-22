import Safe from "@gnosis.pm/safe-deployments/dist/assets/v1.3.0/gnosis_safe_l2.json";
export { OptimisticGovernorAbi } from "./OptimisticGovernor";
export { ModuleProxyFactoryAbi } from "./ModuleProxyFactory";
export { OptimisticOracleV3Abi } from "./OptimisticOracleV3";
export { erc20ABI as Erc20Abi } from "wagmi";
const SafeAbi = Safe.abi;
export { SafeAbi };
