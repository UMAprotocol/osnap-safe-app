import assert from "assert";
import useSwr from "swr";
import { useAccount, useNetwork, usePublicClient } from "wagmi";
import { useMemo } from "react";
import { useImmer } from "use-immer";

import { challengePeriods, currencies } from "@/constants";
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

export function ogDeployerConfigDefaults(
  config?: Partial<OgDeployerConfig>,
): OgDeployerConfig {
  return {
    bondAmount: config?.bondAmount ?? "1000",
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
        .then((result) => {
          console.log("deployment successful", result);
        })
        .catch((err) => {
          console.error("deployment error", err);
        });
    };
  }, [config, address, chain?.id, publicClient, isActive]);
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
  return {
    chain,
    safeAddress: address,
    enabled,
    moduleAddress,
  };
}

export function useOgDisabler() {
  const { moduleAddress, safeAddress } = useOgState();
  const ogAddress = moduleAddress.data;

  const disable = useMemo(() => {
    if (safeAddress === undefined || ogAddress === undefined) {
      // no disable function if any of these are undefined
      return undefined;
    }

    return () => {
      const txs = [disableModule(safeAddress, ogAddress)];
      // TODO: see if we can use wagmi instead, probably need to use multicall here
      safeSdk.txs
        .send({ txs })
        .then((result) => {
          console.log("disabling successful", result);
        })
        .catch((err) => {
          console.error("disabling error", err);
        });
    };
  }, [safeAddress, ogAddress]);
  return {
    disable,
  };
}
