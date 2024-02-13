"use client";

import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { safeWallet } from "@rainbow-me/rainbowkit/wallets";
import { useEffect, useState } from "react";
import { WagmiProvider, http } from "wagmi";
import {
  arbitrum,
  goerli,
  mainnet,
  optimism,
  polygon,
  gnosis,
  coreDao,
} from "wagmi/chains";
import { SafeAutoConnect } from "../hooks/useSafeAutoConnect";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const chains = [
  mainnet,
  polygon,
  optimism,
  arbitrum,
  gnosis,
  coreDao,
  ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [goerli] : []),
] as const;

export const config = getDefaultConfig({
  appName: "oSnap Safe app",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_APP_ID ?? "",
  chains,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [gnosis.id]: http(),
    [goerli.id]: http(),
    [coreDao.id]: http(),
  },
  wallets: [
    {
      groupName: "Gnosis Safe",
      wallets: [safeWallet],
    },
  ],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
            <SafeAutoConnect>{mounted && children}</SafeAutoConnect>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
