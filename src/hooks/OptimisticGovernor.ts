import assert from "assert";
import useSwr from "swr";
import { useAccount, useNetwork, usePublicClient } from "wagmi";
import { useMemo } from "react";
import { useImmer } from "use-immer";
import { readContract } from "@wagmi/core";
import { isAddress, OptimisticGovernorAbi } from "@/libs";

import { challengePeriods, currencies, isCurrency } from "@/constants";
import type { OgDeployerConfig } from "@/types";
import { findContract } from "@/libs";

import { Client as SubgraphClient } from "../libs/ogSubgraph";
import {
  safeSdk,
  disableModule,
  getTokenAddress,
  oSnapIdentifier,
  ogDeploymentTxs,
  publicClientToProvider,
} from "../libs";

export function ogDeployerConfigDefaults(
  config?: Partial<OgDeployerConfig>,
): OgDeployerConfig {
  return {
    bondAmount: config?.bondAmount ?? "2",
    challengePeriod: config?.challengePeriod ?? challengePeriods[0],
    collateralCurrency: config?.collateralCurrency ?? currencies[0],
    quorum: config?.quorum ?? "5",
    spaceUrl: config?.spaceUrl ?? undefined,
  };
}
export function useOgDeployer(initialConfig?: Partial<OgDeployerConfig>) {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [config, setConfig] = useImmer(ogDeployerConfigDefaults(initialConfig));
  const { enabled } = useOgState();
  const isActive = enabled.data ?? false;

  const deploy = useMemo(() => {
    const {
      bondAmount,
      spaceUrl,
      quorum,
      challengePeriod,
      collateralCurrency,
    } = config;

    if (
      // TODO: should probably do input validation here
      !bondAmount.length ||
      !spaceUrl?.length ||
      !quorum.length ||
      !collateralCurrency.length ||
      isActive ||
      address === undefined ||
      chain?.id === undefined
    ) {
      // no deploy function if any of these are undefined
      return undefined;
    }

    return () => {
      const collateral = getTokenAddress(chain.id, collateralCurrency);
      const provider = publicClientToProvider(publicClient);

      const txs = ogDeploymentTxs({
        provider,
        chainId: chain.id,
        executor: address,
        collateral: collateral,
        bond: bondAmount,
        identifier: oSnapIdentifier,
        liveness: challengePeriod.seconds,
        spaceUrl,
        quorum,
        challengePeriodText: challengePeriod.text,
      });
      // TODO: see if we can use wagmi instead, probably need to use multicall here
      safeSdk.txs
        .send({ txs })
        .then(() => {
          // show that osnap is now enabled once tx completes
          return enabled.mutate(true, { revalidate: false });
        })
        .catch((err) => {
          console.error("deployment error", err);
        });
    };
  }, [config, address, chain?.id, publicClient, isActive, enabled]);
  return {
    config,
    setConfig,
    deploy,
  };
}
export function useOgState() {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const enabled = useSwr(`/enabled/${address}/${chain?.id}`, () => {
    assert(chain?.id, "Requires chainid");
    assert(address, "Requires safe address");
    return SubgraphClient(chain.id).isEnabled(address);
  });
  const moduleAddress = useSwr(`/moduleAddress/${address}/${chain?.id}`, () => {
    assert(chain?.id, "Requires chainid");
    assert(address, "Requires safe address");
    return SubgraphClient(chain.id).getModuleAddress(address);
  });
  const collateral = useSwr(
    `/collateral/${moduleAddress.data}/${chain?.id}`,
    async () => {
      assert(chain?.id, "Requires chainid");
      assert(moduleAddress.data, "Requires OG module address");
      assert(
        isAddress(moduleAddress.data),
        "Module Address is not an address: " + moduleAddress.data,
      );
      const collateralAddress = await readContract({
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
        chainId: chain.id,
      });
      assert(
        isCurrency(tokenInfo.name),
        "Unsupported currency: " + tokenInfo.name,
      );
      return tokenInfo.name;
    },
  );
  const liveness = useSwr(
    `/liveness/${moduleAddress.data}/${chain?.id}`,
    async () => {
      assert(chain?.id, "Requires chainid");
      assert(moduleAddress.data, "Requires OG module address");
      assert(
        isAddress(moduleAddress.data),
        "Module Address is not an address: " + moduleAddress.data,
      );
      const liveness: bigint = await readContract({
        address: moduleAddress.data,
        abi: OptimisticGovernorAbi,
        functionName: "liveness",
      });
      return liveness.toString();
    },
  );
  const bond = useSwr(
    `/bondAmount/${moduleAddress.data}/${chain?.id}`,
    async () => {
      assert(chain?.id, "Requires chainid");
      assert(moduleAddress.data, "Requires OG module address");
      assert(
        isAddress(moduleAddress.data),
        "Module Address is not an address: " + moduleAddress.data,
      );
      const bondAmount = await readContract({
        address: moduleAddress.data,
        abi: OptimisticGovernorAbi,
        functionName: "bondAmount",
      });
      return bondAmount.toString();
    },
  );
  const rules = useSwr(
    `/rules/${moduleAddress.data}/${chain?.id}`,
    async () => {
      assert(chain?.id, "Requires chainid");
      assert(moduleAddress.data, "Requires OG module address");
      assert(
        isAddress(moduleAddress.data),
        "Module Address is not an address: " + moduleAddress.data,
      );
      const rules = await readContract({
        address: moduleAddress.data,
        abi: OptimisticGovernorAbi,
        functionName: "rules",
      });
      return rules;
    },
  );
  const optimisticOracleV3Address = useSwr(
    `/optimisticOracleV3Address/${moduleAddress.data}/${chain?.id}`,
    async () => {
      assert(chain?.id, "Requires chainid");
      assert(moduleAddress.data, "Requires OG module address");
      assert(
        isAddress(moduleAddress.data),
        "Module Address is not an address: " + moduleAddress.data,
      );
      const optimisticOracleV3 = await readContract({
        address: moduleAddress.data,
        abi: OptimisticGovernorAbi,
        functionName: "optimisticOracleV3",
      });
      return optimisticOracleV3;
    },
  );
  return {
    chain,
    safeAddress: address,
    enabled,
    moduleAddress,
    collateral,
    liveness,
    bond,
    rules,
    optimisticOracleV3Address,
  };
}

export function useOgDisabler() {
  const { moduleAddress, safeAddress, enabled } = useOgState();
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
        .then(() => {
          // show that osnap is now disabled once tx completes
          return enabled.mutate(false, { revalidate: false });
        })
        .catch((err) => {
          console.error("disabling error", err);
        });
    };
  }, [safeAddress, ogAddress, enabled]);
  return {
    disable,
  };
}
