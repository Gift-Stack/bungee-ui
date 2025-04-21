import { useMutation, useQuery } from "@tanstack/react-query";
import { Asset, Route } from "@/actions/socket/types";
import {
  getApprovalTransactionData,
  checkAllowance,
  getRouteTransactionData,
} from "@/actions/socket";
import { useCapabilities, useSendCalls } from "wagmi/experimental";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { estimateFeesPerGas, estimateGas } from "wagmi/actions";
import { config } from "@/providers";
import { toast } from "sonner";

import { BaseError as ViemBaseError } from "viem";

const swapMutatetionKey = "swap";

const arbitrumChainId = 42161;

type SwapParams = {
  assetIn: Asset;
  assetOut: Asset;
  amount: number;
  route: Route;
};

export const usePrepareSwap = (params: SwapParams) => {
  const { data: capabilities = {} } = useCapabilities();

  const capabilitiesOnArbitrum = capabilities[arbitrumChainId];

  // Check if the wallet is capable of batching transactions -- E.g SAFE wallet
  const isCapableOfBatchingTx =
    !!capabilitiesOnArbitrum?.atomicBatch?.supported;

  const { data: preparedSwapData, ...rest } = useQuery({
    queryKey: [swapMutatetionKey, "prepare"],
    queryFn: async () => {
      const routeTxData = await getRouteTransactionData(params.route);

      let allowance: `${number}` | null = null;

      if (routeTxData.approvalData !== null) {
        const { allowanceTarget, minimumApprovalAmount } =
          routeTxData.approvalData;

        const allowanceCheck = await checkAllowance({
          chainId: params.assetIn.chainId,
          owner: params.route.sender,
          allowanceTarget,
          tokenAddress: params.assetIn.address,
        });

        allowance = allowanceCheck.value;
      } else {
        allowance = null;
      }

      return {
        allowance,
        routeTxData,
      };
    },
  });

  return {
    data: preparedSwapData
      ? {
          ...preparedSwapData,
          isCapableOfBatchingTx,
        }
      : undefined,
    ...rest,
  };
};

export const useSwap = () => {
  const { sendCallsAsync } = useSendCalls();
  const { sendTransactionAsync } = useSendTransaction();

  return useMutation({
    mutationFn: async (
      params: SwapParams & {
        isApproved: boolean;
        preparedSwapData: NonNullable<
          Awaited<ReturnType<typeof usePrepareSwap>>["data"]
        >;
      }
    ) => {
      if (!params.preparedSwapData.isCapableOfBatchingTx) {
      }

      /**
       * STEPS IF NOT BATCHING COMPATIBLE:
       * - Check if approval is required for the token
       * - If it is, get the approval transaction data
       * - If it is not, proceed with the swap
       */

      /**
       * STEPS IF BATCHING COMPATIBLE:
       * - Check if approval is required for the token
       * - If it is, add to an array of transactions to be executed
       * - Add the swap transaction to the array
       * - Execute the transactions
       * - Return the transaction hash
       */

      const txsToExecute = [];

      if (!params.isApproved) {
        // Add to batch
        if (params.preparedSwapData.isCapableOfBatchingTx) {
          const approvalData = params.preparedSwapData.routeTxData.approvalData;
          if (approvalData) {
            const approvalTransactionData = await getApprovalTransactionData({
              chainId: params.assetIn.chainId,
              owner: params.route.sender,
              allowanceTarget: approvalData.allowanceTarget,
              tokenAddress: params.assetIn.address,
              amount: Number(approvalData.minimumApprovalAmount),
            });

            txsToExecute.push(approvalTransactionData);
          }
        } else {
          throw new Error(
            "Not authorized to spend this amount of token -- Please approve token"
          );
        }
      }

      if (params.preparedSwapData.isCapableOfBatchingTx) {
        txsToExecute.push({
          to: params.preparedSwapData.routeTxData.txTarget,
          data: params.preparedSwapData.routeTxData.txData,
          value: params.preparedSwapData.routeTxData.value,
        });

        const result = await sendCallsAsync({
          calls: txsToExecute,
        });

        return {
          result,
          batchedTx: true,
        };
      } else {
        const feePerGas = await estimateFeesPerGas(config);

        const gasEstimate = await estimateGas(config, {
          to: params.preparedSwapData.routeTxData.txTarget,
          value: BigInt(0),
          data: params.preparedSwapData.routeTxData.value,
        });

        const result = await sendTransactionAsync({
          to: params.preparedSwapData.routeTxData.txTarget,
          data: params.preparedSwapData.routeTxData.txData,
          value: BigInt(params.preparedSwapData.routeTxData.value),
          gasPrice: feePerGas.gasPrice,
          gas: gasEstimate,
        });

        return {
          result,
          batchedTx: false,
        };
      }
    },
    mutationKey: [swapMutatetionKey],
    onError: (error) => {
      let message: string;

      if (error instanceof ViemBaseError) {
        console.log("error", {
          shortMessage: error.shortMessage,
          details: error.details,
          message: error.message,
          cause: error.cause,
          errorMessages: error.metaMessages,
          errorName: error.name,
        });
        message = error.details;
      } else {
        message = error.message;
      }

      toast.error("Signature submission failed", {
        description: message,
      });
    },
    onSuccess: (data) => {
      if (data.batchedTx) {
        toast.success("Transaction submitted successfully");
      } else {
        toast.success("Transaction confirmed successfully");
      }
    },
  });
};

type ApproveParams = {
  chainId: number;
  owner: `0x${string}`;
  allowanceTarget: `0x${string}`;
  tokenAddress: `0x${string}`;
  amount: number;
};

export const useApprove = () => {
  const { data: hash, sendTransactionAsync, ...rest } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const mutationData = useMutation({
    mutationFn: async (params: ApproveParams) => {
      const approvalTransactionData = await getApprovalTransactionData(params);

      const feePerGas = await estimateFeesPerGas(config);

      const gasEstimate = await estimateGas(config, {
        to: approvalTransactionData.to,
        value: BigInt(0),
        data: approvalTransactionData.data,
      });

      const tx = await sendTransactionAsync({
        to: approvalTransactionData.to,
        value: BigInt(0),
        data: approvalTransactionData.data,
        gasPrice: feePerGas.gasPrice,
        gas: gasEstimate,
      });

      return tx;
    },
  });

  return { ...mutationData, ...rest, isConfirming, isConfirmed };
};
