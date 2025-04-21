export type UserTX = {
  userTxType: "dex-swap";
  txType: `eth_${string}`;
  swapSlippage: number;
  chainId: number;
  protocol: {
    name: string;
    displayName: string;
    icon: string;
  };
  fromAsset: Asset;
  approvalData: {
    minimumApprovalAmount: `${number}`;
    approvalTokenAddress: string;
    allowanceTarget: string;
    owner: string;
  };
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
  address: string;
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

export type QuoteResponse = {
  routes: Route[];
  fromChainId: number;
  fromAsset: AssetWithPrice;
  toChainId: number;
  toAsset: AssetWithPrice;
};
