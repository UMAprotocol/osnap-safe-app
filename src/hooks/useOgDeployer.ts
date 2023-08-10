import { challengePeriods } from "@/constants/challengePeriods";
import { currencies } from "@/constants/currencies";
import { OgDeployerConfig, OsnapActivationStatus } from "@/types/config";
import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk";
import { useSearchParams } from "next/navigation";
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

export function useOgDeployer() {
  const searchParams = useSearchParams();
  const snapshotSpaceName = searchParams.get("spaceName") ?? undefined;
  const snapshotSpaceUrl = searchParams.get("spaceUrl") ?? undefined;
  const osnapActivationStatus = (searchParams.get("status") ??
    "inactive") as OsnapActivationStatus;
  const errors = [] as string[];

  const initialConfig: OgDeployerConfig = {
    snapshotSpaceUrl,
    snapshotSpaceName,
    osnapActivationStatus,
    collateralCurrency: currencies[0],
    bondAmount: "1000",
    challengePeriod: challengePeriods[0],
    quorum: "5",
    errors,
  };
  const { chain } = useNetwork();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [config, setConfig] = useImmer(initialConfig);

  const deploy = useMemo(() => {
    return () => {
      const {
        bondAmount,
        snapshotSpaceUrl,
        quorum,
        challengePeriod,
        collateralCurrency,
      } = config;

      if (
        bondAmount === "" ||
        snapshotSpaceUrl === undefined ||
        quorum === "" ||
        address === undefined ||
        chain?.id === undefined
      ) {
        // no deploy function if any of these are undefined
        return undefined;
      }

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
        snapshotSpaceUrl,
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
  }, [address, chain?.id, config, publicClient]);
  return {
    config,
    setConfig,
    deploy,
  };
}
