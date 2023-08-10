import { challengePeriods, currencies } from "@/constants";
import type { OgDeployerConfig } from "@/types";
import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk";
import { useMemo } from "react";
import { useImmer } from "use-immer";
import { useAccount, useNetwork, usePublicClient } from "wagmi";
import {
  getTokenAddress,
  oSnapIdentifier,
  ogDeploymentTxs,
  publicClientToProvider,
} from "../libs";
const appsSdk = new SafeAppsSDK();

export function ogDeployerConfigDefaults(
  config?: Partial<OgDeployerConfig>,
): OgDeployerConfig {
  return {
    bondAmount: config?.bondAmount ?? "1000",
    challengePeriod: config?.challengePeriod ?? challengePeriods[0],
    collateralCurrency: config?.collateralCurrency ?? currencies[0],
    quorum: config?.quorum ?? "5",
    isActive: config?.isActive ?? false,
    spaceUrl: config?.spaceUrl ?? undefined,
  };
}
export function useOgDeployer(initialConfig?: Partial<OgDeployerConfig>) {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [config, setConfig] = useImmer(ogDeployerConfigDefaults(initialConfig));

  const deploy = useMemo(() => {
    const {
      bondAmount,
      spaceUrl,
      quorum,
      challengePeriod,
      collateralCurrency,
      isActive,
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
      appsSdk.txs
        .send({ txs })
        .then((result) => {
          console.log("deployment successful", result);
        })
        .catch((err) => {
          console.error("deployment error", err);
        });
    };
  }, [config, address, chain?.id, publicClient]);
  return {
    config,
    setConfig,
    deploy,
  };
}
