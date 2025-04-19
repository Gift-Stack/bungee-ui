import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { WagmiProvider } from "wagmi";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";

import {
  safeWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { arbitrum } from "viem/chains";

const config = getDefaultConfig({
  projectId: "YOUR_PROJECT_ID",
  appName: "Bungee Protocol",
  chains: [arbitrum],
  ssr: true,
  wallets: [
    {
      groupName: "Recommended",
      wallets: [safeWallet, rainbowWallet, walletConnectWallet],
    },
  ],
});

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Providers;
