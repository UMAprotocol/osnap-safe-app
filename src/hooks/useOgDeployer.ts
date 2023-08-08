import {
  ChallengePeriodSeconds,
  ChallengePeriodText,
} from "@/constants/challengePeriods";
import { Currency } from "@/constants/currencies";
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

export type Config = {
  snapshotSpaceUrl: string | undefined; // full snapshot space url
  collateralCurrency: Currency | undefined; // must add more tokens to support more collaterals
  bondAmount: string | undefined; // bond in decimals like 3500.99 usdc
  challengePeriodText: ChallengePeriodText | undefined; // 48 hours, 30 minutes, etc
  challengePeriodSeconds: ChallengePeriodSeconds | undefined; // Period text in seconds
  quorum: string | undefined; // voting quorum
};
export function useOgDeployer(defaultConfig: Config) {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [config, setConfig] = useImmer(defaultConfig);

  const deploy = useMemo(() => {
    const {
      bondAmount,
      snapshotSpaceUrl,
      quorum,
      challengePeriodText,
      challengePeriodSeconds,
      collateralCurrency,
    } = config;
    if (
      bondAmount === undefined ||
      snapshotSpaceUrl === undefined ||
      quorum === undefined ||
      challengePeriodText === undefined ||
      challengePeriodSeconds === undefined ||
      collateralCurrency === undefined ||
      address === undefined ||
      chain?.id === undefined
    ) {
      // no deploy function if any of these are undefined
      return undefined;
    }

    const collateral = getTokenAddress(chain.id, collateralCurrency);
    const provider = publicClientToProvider(publicClient);

    return () => {
      const txs = ogDeploymentTxs({
        provider,
        chainId: chain.id,
        executor: address,
        collateral: collateral,
        bond: bondAmount,
        identifier: oSnapIdentifier,
        liveness: challengePeriodSeconds,
        snapshotSpaceUrl,
        quorum,
        challengePeriodText,
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
  }, [config]);
  return {
    config,
    setConfig,
    deploy,
  };
}
