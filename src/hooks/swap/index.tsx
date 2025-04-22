import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Asset, Route } from "@/actions/socket/types";
import {
  getApprovalTransactionData,
  checkAllowance,
  getRouteTransactionData,
} from "@/actions/socket";
import { useCapabilities, useSendCalls } from "wagmi/experimental";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import {
  estimateFeesPerGas,
  estimateGas,
  waitForTransactionReceipt,
} from "wagmi/actions";
import { config } from "@/providers";
import { toast } from "sonner";

import { BaseError as ViemBaseError } from "viem";
import { shortenAddress } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

const swapMutationKey = "swap";

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
    queryKey: [swapMutationKey, "prepare", { route: params.route }],
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
  const { data: capabilities } = useCapabilities();
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
      const txsToExecute: {
        to: `0x${string}`;
        data?: `0x${string}`;
        value?: bigint | `0x${string}`;
      }[] = [];

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
          capabilities,
          forceAtomic: true,
        });

        return {
          result: result.id,
          batchedTx: true,
        };
      } else {
        const feePerGas = await estimateFeesPerGas(config);

        const gasEstimate = await estimateGas(config, {
          to: params.preparedSwapData.routeTxData.txTarget,
          value: BigInt(params.preparedSwapData.routeTxData.value),
          data: params.preparedSwapData.routeTxData.txData,
        });

        const result = await sendTransactionAsync({
          to: params.preparedSwapData.routeTxData.txTarget,
          data: params.preparedSwapData.routeTxData.txData,
          value: BigInt(params.preparedSwapData.routeTxData.value),
          gasPrice: feePerGas.gasPrice,
          gas: gasEstimate,
        });

        await waitForTransactionReceipt(config, {
          hash: result,
        });

        return {
          result,
          batchedTx: false,
        };
      }
    },
    mutationKey: [swapMutationKey],
    onError: (error) => {
      let message: string;

      if (error instanceof ViemBaseError) {
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
        toast.success("Transaction confirmed successfully", {
          description: (
            <a
              href={`https://arbiscan.io/tx/${data.result}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              {shortenAddress(data.result, 6)}
              <ExternalLink className="size-4" />
            </a>
          ),
        });
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
  const { data: hash, sendTransactionAsync, isPending } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const queryClient = useQueryClient();

  const { isPending: isMutatationPending, ...mutationData } = useMutation({
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

      await queryClient.invalidateQueries({
        queryKey: [swapMutationKey, "prepare"],
      });

      return tx;
    },
  });

  return {
    ...mutationData,
    isConfirming,
    isConfirmed,
    isPending: isMutatationPending || isPending || isConfirming,
  };
};
