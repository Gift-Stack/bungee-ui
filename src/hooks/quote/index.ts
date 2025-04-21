import { useQuery } from "@tanstack/react-query";
import { type Asset } from "@/actions/socket/types";
import { getQuote } from "@/actions/socket";

export const QUOTE_QUERY_KEY = "quote";

export function useQuote({
  assetIn,
  assetOut,
  fromAmount,
  userAddress = "0x0000000000000000000000000000000000000000", // This is a fallback for the case where the user is not connected
  uniqueRoutesPerBridge = false,
  sort = "output",
  singleTxOnly = true,
}: {
  assetIn: Pick<Asset, "address" | "chainId" | "decimals">;
  assetOut: Pick<Asset, "address" | "chainId" | "decimals">;
  fromAmount: number;
  userAddress?: string;
  uniqueRoutesPerBridge?: boolean;
  sort?: "output" | "gas" | "time";
  singleTxOnly?: boolean;
}) {
  return useQuery({
    queryKey: [
      QUOTE_QUERY_KEY,
      assetIn,
      assetOut,
      fromAmount,
      userAddress,
      uniqueRoutesPerBridge,
      sort,
      singleTxOnly,
    ],
    queryFn: async () => {
      return getQuote({
        fromChainId: assetIn.chainId,
        fromTokenAddress: assetIn.address,
        toChainId: assetOut.chainId,
        toTokenAddress: assetOut.address,
        fromAmount: fromAmount * 10 ** assetIn.decimals,
        userAddress,
        uniqueRoutesPerBridge,
        sort,
        singleTxOnly,
      });
    },

    enabled: !!assetIn && !!assetOut && !!fromAmount,
    refetchInterval: 15_000, // 15 seconds
    refetchOnWindowFocus: false,
  });
}
