"use client";

import { useDebounce } from "@/hooks/debounce";
import { useQuote } from "@/hooks/quote";
import { Asset } from "@/actions/socket/types";
import React, { useMemo, useState } from "react";
import AmountInput from "./amount-input";
import { useAccount, useBalance } from "wagmi";
import SwapReview from "./review";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const arbitrumChainId = 42161;

const assetIn: Asset = {
  address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  name: "USD Coin",
  symbol: "USDC",
  decimals: 6,
  logoURI: "https://media.socket.tech/tokens/all/USDC",
  icon: "https://media.socket.tech/tokens/all/USDC",
  chainId: arbitrumChainId,
};

const assetOut: Asset = {
  address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  name: "Ethereum",
  symbol: "ETH",
  decimals: 18,
  logoURI: "https://media.socket.tech/tokens/all/ETH",
  icon: "https://media.socket.tech/tokens/all/ETH",
  chainId: arbitrumChainId,
};

const SwapForm = () => {
  const account = useAccount();

  const { data: assetInBalance } = useBalance({
    address: account.address,
    chainId: arbitrumChainId,
    token: assetIn.address,
  });

  const { data: assetOutBalance } = useBalance({
    address: account.address,
    chainId: arbitrumChainId,
    // Token out not needed since it's native ETH
  });

  const [amount, setAmount] = useState<string>("");
  const [swapReview, setSwapReview] = useState<boolean>(false);

  const debouncedAmount = useDebounce(amount, 300);

  const {
    data: quote,
    isLoading,
    refetch: handleQuoteRefetch,
    isRefetching: isRefetchingQuote,
  } = useQuote({
    assetIn,
    assetOut,
    fromAmount: Number(debouncedAmount || 0),
    userAddress: account.address,
  });

  const route = quote?.routes?.[0];
  const amountOut = Number(route?.toAmount || 0) / 10 ** assetOut.decimals;

  const actionButtonHandler = useMemo(() => {
    if (isLoading) return { label: "Loading...", disabled: true };
    if (amountOut === 0) return { label: "No Quote Found", disabled: true };
    if (
      Number(debouncedAmount) * 10 ** assetIn.decimals >
      Number(assetInBalance?.value || 0)
    )
      return { label: "Insufficient Balance", disabled: true };
    return { label: "Swap", disabled: false };
  }, [isLoading, amountOut, assetInBalance, debouncedAmount]);

  const handleSwap = () => {
    if (!route || !debouncedAmount) return;
    setSwapReview(true);
  };

  if (swapReview && quote)
    return (
      <SwapReview
        handleClose={() => setSwapReview(false)}
        quote={quote}
        assetIn={assetIn}
        assetOut={assetOut}
      />
    );

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-text-primary text-xl font-semibold">Swap</p>
        <div className="flex items-center space-x-2">
          {quote && (
            <button
              className="bg-transparent h-9 w-9 flex items-center justify-center border-none cursor-pointer text-text-primary"
              type="button"
              onClick={() => handleQuoteRefetch()}
              disabled={isRefetchingQuote}
            >
              <RotateCcw
                className={cn("size-5 text-bungee-gold ", {
                  "animate-spin": isRefetchingQuote,
                })}
              />
            </button>
          )}
        </div>
      </div>
      <div className="bg-layer-2 mt-4 relative overflow-hidden rounded-lg">
        <div className="relative pt-[19px]">
          <div className="px-[18px] border-0 border-b border-solid border-border-dark pb-[35px]">
            <div className="flex items-center justify-between w-full">
              <div className="w-full">
                <AmountInput
                  value={Number(amount)}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <button
                className="p-2 rounded-full flex items-center cursor-pointer border-none font-medium text-text-primary space-x-1.5 disabled:opacity-20 text-base leading-[22px] bg-layer-3"
                type="button"
              >
                <div className="relative w-5 h-5">
                  <div className="rounded-full overflow-hidden relative w-full h-full">
                    <img
                      alt={assetIn.name}
                      className="object-cover absolute top-0 left-0 size-5"
                      src={assetIn.logoURI}
                    />
                    <div className="absolute top-0 left-0 w-full h-full border border-solid border-black/10 rounded-full" />
                  </div>
                  <div className="rounded-full overflow-hidden h-2.5 w-2.5 absolute bottom-0 -right-[2.5px]">
                    <img
                      alt="Chain icon"
                      className="object-cover absolute top-0 left-0 size-2.5"
                      src="https://ext.same-assets.com/1381159192/2578158177.svg"
                    />
                    <div className="absolute top-0 left-0 w-full h-full border border-solid border-black/10 rounded-full" />
                  </div>
                </div>
                <span className="whitespace-nowrap"> {assetIn.symbol}</span>
              </button>
            </div>
            <div className="flex items-center w-full mt-2.5 h-5 justify-between">
              <div className="text-sm text-text-secondary">
                {route
                  ? `${route.inputValueInUsd.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}`
                  : null}
              </div>
              <div className="text-sm text-text-secondary flex items-center ml-auto">
                <p>
                  Bal:{" "}
                  <span className="text-text-primary">
                    {(
                      Number(assetInBalance?.value || 0) /
                      10 ** assetIn.decimals
                    ).toLocaleString("en-US", {
                      maximumFractionDigits: 5,
                    })}
                  </span>
                </p>
                <button
                  type="button"
                  className="bg-bungee-gold/10 border-none px-[5px] py-[3px] ml-1 cursor-pointer text-bungee-gold rounded-sm"
                  onClick={() =>
                    setAmount(
                      (
                        Number(assetInBalance?.value || 0) /
                        10 ** assetIn.decimals
                      ).toString()
                    )
                  }
                >
                  MAX
                </button>
              </div>
            </div>
          </div>

          {/* Switch Button */}
          <button
            className="w-9 h-9 rounded-full border-none bg-layer-3 flex items-center justify-center hover:rotate-180 p-0 opacity-60 absolute left-0 right-0 mx-auto top-[103px] cursor-pointer"
            type="button"
            disabled
          >
            <img
              src="https://ext.same-assets.com/1381159192/2563901416.svg"
              alt="Switch Chevron"
              className="w-4 h-[17px]"
            />
          </button>

          {/* Second Input - Destination Token */}
          <div className="px-[18px] pt-[35px] pb-[19px]">
            <div className="flex items-center justify-between">
              {isLoading ? (
                <div className="h-8 w-full max-w-[150px] animate-pulse rounded-lg bg-layer-3" />
              ) : (
                <div className="w-full">
                  <AmountInput
                    value={amountOut}
                    isLoading={isLoading}
                    readOnly
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 rounded-full flex items-center cursor-pointer border-none font-medium text-text-primary space-x-1.5 disabled:opacity-20 text-base leading-[22px] bg-layer-3"
                  type="button"
                >
                  <div className="relative w-5 h-5">
                    <div className="rounded-full overflow-hidden relative w-full h-full">
                      <img
                        alt={assetOut.name}
                        className="object-cover absolute top-0 left-0 size-5"
                        src={assetOut.logoURI}
                      />
                      <div className="absolute top-0 left-0 w-full h-full border border-solid border-black/10 rounded-full" />
                    </div>
                    <div className="rounded-full overflow-hidden h-2.5 w-2.5 absolute bottom-0 -right-[2.5px]">
                      <img
                        alt="Chain icon"
                        className="object-cover absolute top-0 left-0 size-2.5"
                        src="https://ext.same-assets.com/1381159192/2578158177.svg"
                      />
                      <div className="absolute top-0 left-0 w-full h-full border border-solid border-black/10 rounded-full" />
                    </div>
                  </div>
                  <span className="whitespace-nowrap"> {assetOut.symbol}</span>
                </button>
              </div>
            </div>
            <div className="flex items-center w-full mt-2.5 h-5 justify-between">
              <div className="text-sm text-text-secondary">
                {route
                  ? route.receivedValueInUsd.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                  : null}
              </div>
              <div className="text-sm text-text-secondary flex items-center ml-auto">
                <p>
                  Bal:{" "}
                  <span className="text-text-primary">
                    {(
                      Number(assetOutBalance?.value || 0) /
                      10 ** assetOut.decimals
                    ).toLocaleString("en-US", {
                      maximumFractionDigits: 5,
                    })}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="relative h-[50px] text-black text-base flex items-center justify-center border-none bg-bungee-gold disabled:bg-layer-2 disabled:text-text-secondary font-bold w-full text-center cursor-pointer mt-4 rounded-lg"
        disabled={actionButtonHandler.disabled}
        onClick={handleSwap}
      >
        {actionButtonHandler.label}
      </button>
    </>
  );
};

export default SwapForm;
