import { useState } from "react";
import {
  getTokenAddress,
  publicClientToProvider,
  defaultRules,
  oSnapIdentifier,
  OgDeploymentTxsParams,
  ogDeploymentTxs,
} from "../libs";
import { useNetwork, usePublicClient, useAccount } from "wagmi";
import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk";
const appsSdk = new SafeAppsSDK();

export interface Config {
  snapshotSpaceUrl: string; // full snapshot space url
  collateralCurrency: "USDC" | "WETH"; // must add more tokens to support more collaterals
  bondAmount: string; // bond in decimals like 3500.99 usdc
  challengePeriodText: string; // 48 hours, 30 minutes, etc
  challengePeriodSeconds: string; // Period text in seconds
  quorum: string; // voting quorum
}
export function useOgDeployer(config: Partial<Config>) {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [snapshotSpaceUrl, setSnapshotSpaceUrl] = useState(
    config.snapshotSpaceUrl,
  );
  const [bondAmount, setBondAmount] = useState(config.bondAmount);
  const [collateralCurrency, setCollateralCurrency] = useState(
    config.collateralCurrency,
  );
  const [challengePeriodText, setChallengePeriodText] = useState(
    config.challengePeriodText,
  );
  const [challengePeriodSeconds, setChallengePeriodSeconds] = useState(
    config.challengePeriodSeconds,
  );
  const [quorum, setQuorum] = useState(config.quorum);

  let deploy: undefined | (() => void) = undefined;
  if (
    address &&
    bondAmount &&
    snapshotSpaceUrl &&
    quorum &&
    challengePeriodText &&
    challengePeriodSeconds &&
    chain?.id &&
    collateralCurrency
  ) {
    const collateral = getTokenAddress(chain.id, collateralCurrency);
    const provider = publicClientToProvider(publicClient);
    deploy = () => {
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
  }
  return {
    snapshotSpaceUrl,
    setSnapshotSpaceUrl,
    bondAmount,
    setBondAmount,
    collateralCurrency,
    setCollateralCurrency,
    challengePeriodText,
    setChallengePeriodText,
    challengePeriodSeconds,
    setChallengePeriodSeconds,
    quorum,
    setQuorum,
    deploy,
  };
}
