import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { useAccount } from "wagmi";

const WalletConnector = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        mounted,
        openConnectModal,
        openChainModal,
        openAccountModal,
      }) => {
        const connected = mounted && account && chain;

        if (!mounted) return null;
        if (!connected) {
          return (
            <button
              onClick={openConnectModal}
              className="bg-bungee-gold text-black rounded-full px-7 py-3 text-lg font-semibold leading-[21.6px]"
              type="button"
            >
              Connect Wallet
            </button>
          );
        }

        if (chain.unsupported) {
          return (
            <button onClick={openChainModal} type="button">
              Wrong network
            </button>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <button
              onClick={openChainModal}
              className="flex items-center justify-center rounded-full bg-layer-2 p-2 hover:bg-layer-3"
              type="button"
            >
              {chain.hasIcon && (
                <div
                  className="h-6 w-6 overflow-hidden rounded-full"
                  style={{
                    background: chain.iconBackground,
                  }}
                >
                  {chain.iconUrl && (
                    <img
                      alt={chain.name ?? "Chain icon"}
                      src={chain.iconUrl}
                      className="h-full w-full"
                    />
                  )}
                </div>
              )}
            </button>

            <button
              onClick={openAccountModal}
              className="flex items-center gap-2 rounded-full bg-layer-2 px-4 py-2 font-medium hover:bg-layer-3"
              type="button"
            >
              <span className="text-text-secondary">
                {Number(account.balanceFormatted || 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6,
                })}{" "}
                ETH
              </span>
              <span>{account.displayName}</span>
            </button>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default WalletConnector;
