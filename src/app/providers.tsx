"use client";

import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { safeWallet } from "@rainbow-me/rainbowkit/wallets";
import { useEffect, useState } from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import {
  arbitrum,
  goerli,
  mainnet,
  optimism,
  polygon,
  gnosis,
  sepolia,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { coreDao } from "./customChains";
import { SafeAutoConnect } from "../hooks/useSafeAutoConnect";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    gnosis,
    coreDao,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [goerli, sepolia]
      : []),
  ],
  [publicProvider()],
);

const connectors = connectorsForWallets([
  {
    groupName: "Gnosis Safe",
    wallets: [
      safeWallet({
        chains,
        allowedDomains: [
          /gnosis-safe.io$/,
          /app.safe.global$/,
          /safe.coredao.org$/,
        ],
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
      <RainbowKitProvider chains={chains}>
        <SafeAutoConnect>{mounted && children}</SafeAutoConnect>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
