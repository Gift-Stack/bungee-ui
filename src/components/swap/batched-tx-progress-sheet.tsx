import React from "react";
import Sheet from "../ui/sheet";
import { useCallsStatus } from "wagmi/experimental";
import { CheckCircle2, Clock, XCircle, Copy, Loader2 } from "lucide-react";
import { cn, shortenAddress } from "@/lib/utils";
import { toast } from "sonner";

const BatchedTxProgressSheet = ({
  isOpen,
  onClose,
  id,
}: {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}) => {
  const { data: callsStatus } = useCallsStatus({
    id,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="size-5 text-green-500" />;
      case "pending":
        return <Clock className="size-5 text-yellow-500" />;
      case "failed":
        return <XCircle className="size-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "Completed";
      case "pending":
        return "In Progress";
      case "failed":
        return "Failed";
      default:
        return "Unknown";
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Confirming transaction on Arbitrum"
    >
      <div className="space-y-6">
        {/* Overall Status */}
        <div className="flex items-center justify-between p-4 bg-layer-2 rounded-lg">
          <div className="flex items-center space-x-2">
            {getStatusIcon(callsStatus?.status || "pending")}
            <span className="text-text-primary font-medium">
              {getStatusText(callsStatus?.status || "pending")}
            </span>
          </div>
          {callsStatus?.status === "pending" && (
            <div className="text-text-secondary text-sm">
              Waiting for confirmations...
            </div>
          )}
        </div>

        {/* Signature Progress (for Safe wallets) */}
        {callsStatus?.status === "pending" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm gap-2">
              <span className="text-text-secondary">Signature Progress</span>
              <Loader2 className="size-4 text-text-primary animate-spin" />
            </div>
            <div className="h-2 bg-layer-3 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full bg-bungee-gold transition-all duration-300",
                  "w-0" // This would be dynamic based on actual signature progress
                )}
              />
            </div>
          </div>
        )}

        {/* Transaction Receipts */}
        {callsStatus?.receipts && callsStatus.receipts.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-text-primary font-medium">
              Transaction Details (atomic:{" "}
              {callsStatus.atomic ? "true" : "false"})
            </h3>
            <div className="space-y-3">
              {callsStatus.receipts.map((receipt, index) => (
                <div
                  key={index}
                  className="p-4 bg-layer-2 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(receipt.status)}
                      <span className="text-text-primary">
                        Transaction {index + 1}
                      </span>
                    </div>
                    <span className="text-text-secondary text-sm">
                      {typeof receipt.gasUsed === "bigint"
                        ? receipt.gasUsed.toString()
                        : receipt.gasUsed}{" "}
                      gas used
                    </span>
                  </div>

                  <div className="text-sm space-y-1">
                    <a
                      href={`https://arbiscan.io/tx/${receipt.transactionHash}`}
                      target="_blank"
                      className="flex justify-between items-center"
                    >
                      <span className="text-text-secondary">Receipt:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-text-primary font-mono">
                          {shortenAddress(receipt.transactionHash, 6)}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              receipt.transactionHash,
                              "Transaction hash"
                            )
                          }
                          className="p-1 hover:bg-layer-3 rounded-md transition-colors"
                          title="Copy transaction hash"
                        >
                          <Copy className="size-4 text-text-secondary hover:text-text-primary" />
                        </button>
                      </div>
                    </a>
                    <a
                      href={`https://arbiscan.io/block/${receipt.blockNumber}`}
                      target="_blank"
                      className="flex justify-between items-center"
                    >
                      <span className="text-text-secondary">Block:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-text-primary">
                          {parseInt(receipt.blockNumber.toString(), 16)}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              parseInt(
                                receipt.blockNumber.toString(),
                                16
                              ).toString(),
                              "Block number"
                            )
                          }
                          className="p-1 hover:bg-layer-3 rounded-md transition-colors"
                          title="Copy block number"
                        >
                          <Copy className="size-4 text-text-secondary hover:text-text-primary" />
                        </button>
                      </div>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
};

export default BatchedTxProgressSheet;
