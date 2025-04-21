import { useMutation } from "@tanstack/react-query";
import { Asset, Route } from "../quote/types";
import { useCapabilities } from "wagmi/experimental";

const swapMutatetionKey = "swap";

const arbitrumChainId = 42161;

type SwapParams = {
  assetIn: Asset;
  assetOut: Asset;
  amount: number;
  route: Route;
};

export const useSwap = () => {
  const { data: capabilities = {} } = useCapabilities();

  const capabilitiesOnArbitrum = capabilities[arbitrumChainId];

  // Check if the wallet is capable of batching transactions -- E.g SAFE wallet
  const isCapableOfBatchingTx =
    !!capabilitiesOnArbitrum?.atomicBatch?.supported;

  return useMutation({
    mutationFn: async (params: SwapParams) => {
      return;
    },
    mutationKey: [swapMutatetionKey],
  });
};
