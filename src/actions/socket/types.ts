export type SocketResponse<T> = {
  success: boolean;
  result: T;
};

export type ApprovalData = {
  minimumApprovalAmount: `${number}`;
  approvalTokenAddress: string;
  allowanceTarget: string;
  owner: string;
} | null; // null if token is native

export type UserTxType = "dex-swap";

export type UserTX = {
  userTxType: UserTxType;
  txType: `eth_${string}`;
  swapSlippage: number;
  chainId: number;
  protocol: {
    name: string;
    displayName: string;
    icon: string;
  };
  fromAsset: Asset;
  approvalData: ApprovalData;
  fromAmount: `${number}`;
  toAsset: Asset;
  toAmount: `${number}`;
  minAmountOut: `${number}`;
  gasFees: {
    gasAmount: `${number}`;
    gasLimit: number;
    asset: Asset;
    feesInUsd: number;
  };
  sender: string;
  recipient: string;
  userTxIndex: number;
};

export type Route = {
  routeId: string;
  isOnlySwapRoute: boolean;
  fromAmount: `${number}`;
  toAmount: `${number}`;
  sender: string;
  recipient: string;
  totalUserTx: number;
  totalGasFeesInUsd: number;
  userTxs: UserTX[];
  usedDexName: string;
  integratorFee: {
    amount: `${number}`;
    asset: Asset;
  };
  outputValueInUsd: number;
  receivedValueInUsd: number;
  inputValueInUsd: number;
};

export type Asset = {
  chainId: number;
  address: `0x${string}`;
  symbol: string;
  name: string;
  decimals: number;
  icon: string;
  logoURI: string;
  chainAgnosticId?: null;
};

export type AssetWithPrice = Asset & {
  priceInUsd: number;
};

export type Quote = {
  routes: Route[];
  fromChainId: number;
  fromAsset: AssetWithPrice;
  toChainId: number;
  toAsset: AssetWithPrice;
};
