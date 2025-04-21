import { useQuery } from "@tanstack/react-query";
import { Asset, QuoteResponse } from "./types";

const BUNGEE_PUBLIC_API_KEY = "72a5b4b0-e727-48be-8aa1-5da9d62fe635"; // SOCKET PUBLIC API KEY

export const QUOTE_QUERY_KEY = "quote";

export function useQuote({
  assetIn,
  assetOut,
  fromAmount,
  userAddress,
  uniqueRoutesPerBridge = false,
  sort = "output",
  singleTxOnly = false,
}: {
  assetIn: Pick<Asset, "address" | "chainId" | "decimals">;
  assetOut: Pick<Asset, "address" | "chainId" | "decimals">;
  fromAmount: number;
  userAddress: string;
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

// Makes a GET request to Bungee APIs for quote
async function getQuote({
  fromChainId,
  fromTokenAddress,
  toChainId,
  toTokenAddress,
  fromAmount,
  userAddress,
  uniqueRoutesPerBridge,
  sort,
  singleTxOnly,
}: {
  fromChainId: number;
  fromTokenAddress: string;
  toChainId: number;
  toTokenAddress: string;
  fromAmount: number;
  userAddress: string;
  uniqueRoutesPerBridge: boolean;
  sort: string;
  singleTxOnly: boolean;
}) {
  const baseUrl = new URL("https://api.socket.tech/v2/quote");
  baseUrl.searchParams.set("fromChainId", fromChainId.toString());
  baseUrl.searchParams.set("fromTokenAddress", fromTokenAddress);
  baseUrl.searchParams.set("toChainId", toChainId.toString());
  baseUrl.searchParams.set("toTokenAddress", toTokenAddress);
  baseUrl.searchParams.set("fromAmount", fromAmount.toString());
  baseUrl.searchParams.set("userAddress", userAddress);
  baseUrl.searchParams.set(
    "uniqueRoutesPerBridge",
    uniqueRoutesPerBridge.toString()
  );
  baseUrl.searchParams.set("sort", sort);
  baseUrl.searchParams.set("singleTxOnly", singleTxOnly.toString());

  const response = await fetch(baseUrl.toString(), {
    method: "GET",
    headers: {
      "API-KEY": BUNGEE_PUBLIC_API_KEY,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const json = (await response.json()) as {
    success: boolean;
    result: QuoteResponse;
  };
  if (!json.success) {
    throw new Error("Failed to get quote");
  }
  return json.result;
}
