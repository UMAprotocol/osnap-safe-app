import assert from "assert";
import useSwr from "swr";
import { TransactionStatus } from "@gnosis.pm/safe-apps-sdk";
import { useAccount, useChainId, usePublicClient } from "wagmi";
import { useMemo, useState } from "react";
import { useImmer } from "use-immer";
import { readContract } from "@wagmi/core";
import {
  isAddress,
  OptimisticGovernorAbi,
  extractParamsFromRules,
  findContract,
  sleep,
} from "@/libs";

import {
  challengePeriods,
  currencies,
  isCurrency,
  findChallengePeriod,
} from "@/constants";
import type { OgDeployerConfig } from "@/types";

import { Client as SubgraphClient } from "../libs/ogSubgraph";
import {
  safeSdk,
  disableModule,
  getTokenAddress,
  oSnapIdentifier,
  ogDeploymentTxs,
  publicClientToProvider,
} from "../libs";
import { Defaults, getSnapshotDefaultVotingParameters } from "@/libs/snapshot";
import useSWR from "swr";
import { ethers } from "ethers";
import { config } from "@/app/providers";

export function ogDeployerConfigDefaults(
  config?: Partial<OgDeployerConfig>,
): OgDeployerConfig {
  return {
    bondAmount: config?.bondAmount ?? "2",
    challengePeriod: config?.challengePeriod ?? challengePeriods[0],
    collateralCurrency: config?.collateralCurrency ?? currencies[0],
    quorum: config?.quorum ?? "5",
    votingPeriodHours: config?.votingPeriodHours ?? "24",
    spaceUrl: config?.spaceUrl ?? undefined,
  };
}
export function useSpaceDefaultVotingParameters(spaceUrl?: string) {
  // fetch default space settings from snapshot space
  return useSWR<Defaults>(
    spaceUrl ?? null,
    getSnapshotDefaultVotingParameters,
    {
      revalidateOnFocus: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
    },
  );
}

type ConfigReturnType = {
  isLoading: boolean;
  data?: OgDeployerConfig;
  error?: Error;
};

export function useLoadOgDeployerConfig(params: {
  spaceUrl?: string;
}): ConfigReturnType {
  const spaceDefaults = useSpaceDefaultVotingParameters(params.spaceUrl);
  const ogState = useOgState();
  return useMemo(() => {
    if (!params.spaceUrl) {
      return {
        isLoading: false,
        error: new Error("Requires space url"),
      };
    }
    // we need to load in defaults from async places
    if (
      spaceDefaults.isLoading ||
      ogState.enabled.isLoading ||
      ogState.bond.isLoading ||
      ogState.collateralInfo.isLoading ||
      ogState.liveness.isLoading
    ) {
      return {
        isLoading: true,
      };
    }
    if (
      ogState.enabled.data &&
      spaceDefaults.data &&
      ogState.rules.data &&
      ogState.bond.data &&
      ogState.liveness.data &&
      ogState.collateralInfo.data
    ) {
      const ruleParams = extractParamsFromRules(ogState.rules.data);
      const bondAmount = ethers.formatUnits(
        ogState.bond.data,
        ogState.collateralInfo.data.decimals,
      );
      return {
        isLoading: false,
        data: ogDeployerConfigDefaults({
          bondAmount,
          collateralCurrency: ogState.collateralInfo.data.name,
          quorum: ruleParams.quorum,
          votingPeriodHours: ruleParams.votingPeriodHours,
          challengePeriod: findChallengePeriod(ogState.liveness.data),
          spaceUrl: params.spaceUrl,
        }),
      };
    }
    if (!ogState.enabled.data && spaceDefaults.data) {
      return {
        isLoading: false,
        data: ogDeployerConfigDefaults({
          quorum: spaceDefaults.data.quorum.toString(),
          votingPeriodHours: spaceDefaults.data.period.toString(),
          spaceUrl: params.spaceUrl,
        }),
      };
    }
    return {
      isLoading: true,
    };
  }, [spaceDefaults, ogState, params.spaceUrl]);
}
export function useOgDeployer(initialConfig?: Partial<OgDeployerConfig>) {
  const chainId = useChainId();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { enabled } = useOgState();
  const isActive = enabled.data ?? false;
  const [isDeploying, setIsDeploying] = useState(false);

  const [config, setConfig] = useImmer(ogDeployerConfigDefaults(initialConfig));

  const deploy = useMemo(() => {
    const {
      bondAmount,
      spaceUrl,
      quorum,
      votingPeriodHours,
      challengePeriod,
      collateralCurrency,
    } = config;

    if (
      // TODO: should probably do input validation here
      !bondAmount.length ||
      !spaceUrl?.length ||
      !quorum.length ||
      !votingPeriodHours.length ||
      !collateralCurrency.length ||
      isActive ||
      address === undefined
    ) {
      // no deploy function if any of these are undefined
      return undefined;
    }

    return async () => {
      const collateral = getTokenAddress(chainId, collateralCurrency);
      const provider = publicClientToProvider(publicClient);

      const txs = await ogDeploymentTxs({
        provider,
        chainId,
        executor: address,
        collateral: collateral,
        bond: bondAmount,
        identifier: oSnapIdentifier,
        liveness: challengePeriod.seconds,
        spaceUrl,
        quorum,
        votingPeriodHours,
      });
      // TODO: see if we can use wagmi instead, probably need to use multicall here
      safeSdk.txs
        .send({ txs })
        .then(async (result) => {
          setIsDeploying(true);
          let safeTx = await safeSdk.txs.getBySafeTxHash(result.safeTxHash);
          while (safeTx.txStatus !== TransactionStatus.SUCCESS) {
            await sleep(1000);
            safeTx = await safeSdk.txs.getBySafeTxHash(result.safeTxHash);
          }
          // show that osnap is now enabled once tx completes
          return enabled.mutate(true, { revalidate: false });
        })
        .catch((err) => {
          console.error("deployment error", err);
        })
        .finally(() => {
          setIsDeploying(false);
        });
    };
  }, [config, address, chainId, publicClient, isActive, enabled]);
  return {
    config,
    setConfig,
    deploy,
    isDeploying,
  };
}
export function useOgState() {
  const chainId = useChainId();
  const { address } = useAccount();
  const enabled = useSwr(`/enabled/${address}/${chainId}`, () => {
    assert(chainId, "Requires chainid");
    assert(address, "Requires safe address");
    return SubgraphClient(chainId).isEnabled(address);
  });
  const moduleAddress = useSwr(`/moduleAddress/${address}/${chainId}`, () => {
    assert(chainId, "Requires chainid");
    assert(address, "Requires safe address");
    return SubgraphClient(chainId).getModuleAddress(address);
  });
  const collateralInfo = useSwr(
    `/collateral/${moduleAddress.data}/${chainId}`,
    async () => {
      assert(chainId, "Requires chainid");
      assert(moduleAddress.data, "Requires OG module address");
      assert(
        isAddress(moduleAddress.data),
        "Module Address is not an address: " + moduleAddress.data,
      );
      const collateralAddress = await readContract(config, {
        address: moduleAddress.data,
        abi: OptimisticGovernorAbi,
        functionName: "collateral",
      });
      assert(
        isAddress(collateralAddress),
        "collateralAddress not properly defined address: " + collateralAddress,
      );
      const tokenInfo = findContract({
        address: collateralAddress,
        chainId: chainId,
      });
      assert(
        isCurrency(tokenInfo.name),
        "Unsupported currency: " + tokenInfo.name,
      );
      assert(tokenInfo.name, "Missing token name");
      assert(tokenInfo.decimals, "Missing token decimals");

      const result = {
        name: tokenInfo.name,
        decimals: tokenInfo.decimals,
      };
      return result;
    },
  );
  const liveness = useSwr(
    `/liveness/${moduleAddress.data}/${chainId}`,
    async () => {
      assert(chainId, "Requires chainid");
      assert(moduleAddress.data, "Requires OG module address");
      assert(
        isAddress(moduleAddress.data),
        "Module Address is not an address: " + moduleAddress.data,
      );
      const liveness: bigint = await readContract(config, {
        address: moduleAddress.data,
        abi: OptimisticGovernorAbi,
        functionName: "liveness",
      });
      return liveness.toString();
    },
  );
  const bond = useSwr(
    `/bondAmount/${moduleAddress.data}/${chainId}`,
    async () => {
      assert(chainId, "Requires chainid");
      assert(moduleAddress.data, "Requires OG module address");
      assert(
        isAddress(moduleAddress.data),
        "Module Address is not an address: " + moduleAddress.data,
      );
      const bondAmount = await readContract(config, {
        address: moduleAddress.data,
        abi: OptimisticGovernorAbi,
        functionName: "bondAmount",
      });
      return bondAmount;
    },
  );
  const rules = useSwr(`/rules/${moduleAddress.data}/${chainId}`, async () => {
    assert(chainId, "Requires chainid");
    assert(moduleAddress.data, "Requires OG module address");
    assert(
      isAddress(moduleAddress.data),
      "Module Address is not an address: " + moduleAddress.data,
    );
    const rules = await readContract(config, {
      address: moduleAddress.data,
      abi: OptimisticGovernorAbi,
      functionName: "rules",
    });
    return rules;
  });
  const optimisticOracleV3Address = useSwr(
    `/optimisticOracleV3Address/${moduleAddress.data}/${chainId}`,
    async () => {
      assert(chainId, "Requires chainid");
      assert(moduleAddress.data, "Requires OG module address");
      assert(
        isAddress(moduleAddress.data),
        "Module Address is not an address: " + moduleAddress.data,
      );
      const optimisticOracleV3 = await readContract(config, {
        address: moduleAddress.data,
        abi: OptimisticGovernorAbi,
        functionName: "optimisticOracleV3",
      });
      return optimisticOracleV3;
    },
  );
  return {
    chainId,
    safeAddress: address,
    enabled,
    moduleAddress,
    collateralInfo,
    liveness,
    bond,
    rules,
    optimisticOracleV3Address,
  };
}

export function useOgDisabler() {
  const { moduleAddress, safeAddress, enabled } = useOgState();
  const [isDisabling, setIsDisabling] = useState(false);
  const ogAddress = moduleAddress.data;

  const disable = useMemo(() => {
    if (safeAddress === undefined || ogAddress === undefined) {
      // no disable function if any of these are undefined
      return undefined;
    }

    return () => {
      const txs = [disableModule(safeAddress, ogAddress)];
      safeSdk.txs
        .send({ txs })
        .then(async (result) => {
          setIsDisabling(true);
          let safeTx = await safeSdk.txs.getBySafeTxHash(result.safeTxHash);
          while (safeTx.txStatus !== TransactionStatus.SUCCESS) {
            await sleep(1000);
            safeTx = await safeSdk.txs.getBySafeTxHash(result.safeTxHash);
          }
          // show that osnap is now disabled once tx completes
          return enabled.mutate(false, { revalidate: false });
        })
        .catch((err) => {
          console.error("disabling error", err);
        })
        .finally(() => {
          setIsDisabling(false);
        });
    };
  }, [safeAddress, ogAddress, enabled]);
  return {
    disable,
    isDisabling,
  };
}
