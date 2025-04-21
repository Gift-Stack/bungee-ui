import { Asset, Quote } from "@/actions/socket/types";
import { ChevronsRight, X } from "lucide-react";
import React, { useMemo } from "react";
import { cn, shortenAddress } from "@/lib/utils";
import { useSwap, usePrepareSwap, useApprove } from "@/hooks/swap";
import AppLogo from "../app-logo";
import { useAccount } from "wagmi";

const SwapReview = ({
  handleClose,
  quote,
  assetIn,
  assetOut,
}: {
  handleClose: () => void;
  quote: Quote;
  assetIn: Asset;
  assetOut: Asset;
}) => {
  const route = quote.routes[0];
  const amountIn = Number(route?.fromAmount || 0) / 10 ** assetIn.decimals;
  const amountOut = Number(route?.toAmount || 0) / 10 ** assetOut.decimals;

  const exchangeRate = amountOut / amountIn;

  const { address } = useAccount();
  const { mutate: swap, isPending: isSwapping } = useSwap();

  const {
    data: preparedSwapData,
    isLoading: isPreparingSwap,
    refetch: refetchPreparedSwapData,
  } = usePrepareSwap({
    assetIn,
    assetOut,
    amount: amountIn,
    route,
  });

  const { mutateAsync: approve, isPending: isApproving } = useApprove();

  const isApproved = useMemo(() => {
    // Allowance is null if the token is native
    if (!preparedSwapData) {
      return false;
    }

    if (
      preparedSwapData.allowance === null ||
      !preparedSwapData.routeTxData.approvalData
    ) {
      return true;
    }

    if (
      Number(preparedSwapData.allowance) <
      Number(preparedSwapData.routeTxData.approvalData.minimumApprovalAmount)
    ) {
      return false;
    }

    return true;
  }, [preparedSwapData]);

  const actionButtonHandler = useMemo(() => {
    if (isPreparingSwap || !preparedSwapData) {
      return { label: "Preparing...", disabled: true };
    }

    if (preparedSwapData.isCapableOfBatchingTx) {
      return { label: "Complete Swap", disabled: false };
    }

    if (!isApproved) {
      return { label: `Approve ${assetIn.symbol}`, disabled: false };
    }

    return { label: "Complete Swap", disabled: false };
  }, [assetIn.symbol, isApproved, isPreparingSwap, preparedSwapData]);

  const handleApprove = async () => {
    if (!preparedSwapData || !preparedSwapData.routeTxData.approvalData) {
      return;
    }
    await approve({
      allowanceTarget: preparedSwapData.routeTxData.approvalData
        .allowanceTarget as `0x${string}`,
      amount: Number(
        preparedSwapData.routeTxData.approvalData.minimumApprovalAmount
      ),
      chainId: assetIn.chainId,
      owner: preparedSwapData.routeTxData.approvalData.owner as `0x${string}`,
      tokenAddress: preparedSwapData.routeTxData.approvalData
        .approvalTokenAddress as `0x${string}`,
    });

    refetchPreparedSwapData();
  };

  const handleSwap = async () => {
    if (!preparedSwapData) {
      return;
    }

    const isCapableOfBatchingTx = !!preparedSwapData.isCapableOfBatchingTx;

    console.log("isApproved", isApproved, isCapableOfBatchingTx);
    if (!isApproved && !isCapableOfBatchingTx) {
      await handleApprove();

      return;
    }

    swap({
      assetIn,
      assetOut,
      amount: amountIn,
      route,
      isApproved,
      preparedSwapData,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div />
        <p className="text-text-primary text-xl font-semibold">Review</p>
        <button
          className="bg-transparent h-9 w-9 flex items-center justify-center border-none cursor-pointer text-text-primary"
          type="button"
          onClick={() => handleClose()}
        >
          <X className="size-5 text-text-primary" />
        </button>
      </div>

      {/* Token Display */}
      <div className="flex items-center justify-center space-x-4 border border-border-dark bg-layer-2 w-max mx-auto p-2 rounded-full">
        <div className="relative w-8 h-8">
          <img
            src={assetIn.logoURI}
            alt={assetIn.symbol}
            className="w-full h-full rounded-full"
          />
        </div>
        <ChevronsRight className="size-6 text-text-secondary" />
        <div className="relative w-8 h-8">
          <img
            src={assetOut.logoURI}
            alt={assetOut.symbol}
            className="w-full h-full rounded-full"
          />
        </div>
      </div>

      {/* Swap Details */}
      <div className="text-center">
        <p className="text-text-secondary mb-1.5 text-sm">You're Swapping</p>
        <p className="text-text-primary text-base font-mono">
          <span className="text-text-secondary">
            {amountIn.toFixed(3)} {assetIn.symbol}
          </span>{" "}
          on Arbitrum to receive{" "}
          <span className="text-text-secondary">
            {amountOut.toFixed(3)} {assetOut.symbol}
          </span>{" "}
          on Arbitrum
        </p>
      </div>

      {/* Transaction Details */}
      <div className="space-y-4 border border-dashed border-border-dark rounded-lg p-4 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Gas Fee:</span>
          <div className="flex items-center">
            <span
              className={cn("mr-2", {
                "text-purple-400": !route?.totalGasFeesInUsd,
                "text-text-secondary": route?.totalGasFeesInUsd,
              })}
            >
              {route?.totalGasFeesInUsd
                ? route.totalGasFeesInUsd.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 4,
                  })
                : "No Gas Fee"}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Min. {assetOut.symbol}:</span>
          <div className="flex items-center">
            <img
              src={assetOut.logoURI}
              alt={assetOut.symbol}
              className="w-4 h-4 mr-1"
            />
            {/* <span className="text-text-primary">0.003 ($4.91)</span> */}
            <span className="text-text-primary">
              {amountOut.toLocaleString("en-US", {
                maximumFractionDigits: 5,
              })}{" "}
              {/* ($4.91) */}(
              {route.receivedValueInUsd.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
              )
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Exchange Rate:</span>
          <span className="text-text-primary">
            1 {assetIn.symbol} ~{" "}
            {exchangeRate.toLocaleString("en-US", {
              maximumFractionDigits: 5,
            })}{" "}
            {assetOut.symbol}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Slippage:</span>
          <span className="text-text-primary">
            1% - <span className="text-text-secondary">Suggested</span>
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Est. Swap Time:</span>
          <div className="flex items-center">
            <img
              src="https://ext.same-assets.com/1381159192/2563901416.svg"
              alt="Bungee"
              className="w-4 h-4 mr-1"
            />
            <span className="text-text-primary">Bungee ~ 30 sec</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Recipient Address:</span>
          <span className="text-text-primary">
            {shortenAddress(address || "")}
          </span>
        </div>
      </div>

      {/* Approve Button */}
      <button
        type="button"
        className="w-full h-12 flex items-center justify-center  bg-bungee-gold text-black disabled:bg-layer-2 disabled:text-text-secondary font-semibold rounded-lg border-none cursor-pointer"
        disabled={actionButtonHandler.disabled || isPreparingSwap || isSwapping}
        onClick={handleSwap}
      >
        {isSwapping ? (
          <AppLogo animate={true} className="*:size-2.5" />
        ) : (
          actionButtonHandler.label
        )}
      </button>
    </div>
  );
};

export default SwapReview;
