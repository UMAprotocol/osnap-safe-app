"use client";

import {
  RainbowKitProvider,
  connectorsForWallets,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import { safeWallet } from "@rainbow-me/rainbowkit/wallets";
import { useEffect, useState } from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { arbitrum, goerli, mainnet, optimism, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { SafeAutoConnect } from "../hooks/useSafeAutoConnect";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [goerli] : []),
  ],
  [publicProvider()],
);

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_APP_ID ?? "";

const { wallets } = getDefaultWallets({
  appName: "OSnap Safe App",
  projectId,
  chains,
});

const demoAppInfo = {
  appName: "OSnap Safe App",
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Gnosis Safe",
    wallets: [
      safeWallet({
        chains,
        allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
        debug: false,
      }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} appInfo={demoAppInfo}>
        <SafeAutoConnect>{mounted && children}</SafeAutoConnect>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
