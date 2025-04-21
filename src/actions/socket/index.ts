import type {
  ApprovalData,
  Quote,
  Route,
  SocketResponse,
  UserTxType,
} from "./types";

const NEXT_PUBLIC_SOCKET_API_KEY = process.env.NEXT_PUBLIC_SOCKET_API_KEY!;
const baseUrl = "https://api.socket.tech/v2";

/**
 * @description GET request to get quote for a swap
 * */
export async function getQuote({
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
  const url = new URL(`${baseUrl}/quote`);
  url.searchParams.set("fromChainId", fromChainId.toString());
  url.searchParams.set("fromTokenAddress", fromTokenAddress);
  url.searchParams.set("toChainId", toChainId.toString());
  url.searchParams.set("toTokenAddress", toTokenAddress);
  url.searchParams.set("fromAmount", fromAmount.toString());
  url.searchParams.set("userAddress", userAddress);
  url.searchParams.set(
    "uniqueRoutesPerBridge",
    uniqueRoutesPerBridge.toString()
  );
  url.searchParams.set("sort", sort);
  url.searchParams.set("singleTxOnly", singleTxOnly.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "API-KEY": NEXT_PUBLIC_SOCKET_API_KEY,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const json = (await response.json()) as SocketResponse<Quote>;
  if (!json.success) {
    throw new Error("Failed to get quote");
  }
  return json.result;
}

/**
 * @description Makes a POST request to Bungee APIs for swap/bridge transaction data
 * */
export async function getRouteTransactionData(route: Route) {
  const url = new URL(`${baseUrl}/build-tx`);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "API-KEY": NEXT_PUBLIC_SOCKET_API_KEY,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ route: route }),
  });

  const json = (await response.json()) as SocketResponse<{
    approvalData: ApprovalData;
    chainId: number;
    txData: `0x${string}`;
    txTarget: `0x${string}`;
    txType: `eth_${string}`;
    userTxIndex: number;
    userTxType: UserTxType;
    value: `0x${string}`;
  }>;
  if (!json.success) {
    throw new Error("Failed to get route transaction data");
  }
  return json.result;
}

/**
 * @description GET request to check token allowance given to allowanceTarget by owner
 * */
export async function checkAllowance({
  chainId,
  owner,
  allowanceTarget,
  tokenAddress,
}: {
  chainId: number;
  owner: string;
  allowanceTarget: string;
  tokenAddress: string;
}) {
  const url = new URL(`${baseUrl}/approval/check-allowance`);
  url.searchParams.set("chainID", chainId.toString());
  url.searchParams.set("owner", owner);
  url.searchParams.set("allowanceTarget", allowanceTarget);
  url.searchParams.set("tokenAddress", tokenAddress);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "API-KEY": NEXT_PUBLIC_SOCKET_API_KEY,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const json = (await response.json()) as SocketResponse<{
    value: `${number}`;
    tokenAddress: string;
  }>;
  if (!json.success) {
    throw new Error("Failed to check allowance");
  }
  return json.result;
}

/**
 * @description Fetches transaction data for token approval
 * */
export async function getApprovalTransactionData({
  chainId,
  owner,
  allowanceTarget,
  tokenAddress,
  amount,
}: {
  chainId: number;
  owner: string;
  allowanceTarget: string;
  tokenAddress: string;
  amount: number;
}) {
  const url = new URL(`${baseUrl}/approval/build-tx`);
  url.searchParams.set("chainID", chainId.toString());
  url.searchParams.set("owner", owner);
  url.searchParams.set("allowanceTarget", allowanceTarget);
  url.searchParams.set("tokenAddress", tokenAddress);
  url.searchParams.set("amount", amount.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "API-KEY": NEXT_PUBLIC_SOCKET_API_KEY,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const json = (await response.json()) as SocketResponse<{
    data: `0x${string}`;
    to: `0x${string}`;
  }>;
  if (!json.success) {
    throw new Error("Failed to get approval transaction data");
  }
  return json.result;
}

/**
 * @description Fetches status of the bridging transaction
 * */
export async function getBridgeStatus({
  transactionHash,
  fromChainId,
  toChainId,
}: {
  transactionHash: string;
  fromChainId: number;
  toChainId: number;
}) {
  const url = new URL(`${baseUrl}/bridge-status`);
  url.searchParams.set("transactionHash", transactionHash);
  url.searchParams.set("fromChainId", fromChainId.toString());
  url.searchParams.set("toChainId", toChainId.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "API-KEY": NEXT_PUBLIC_SOCKET_API_KEY,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();
  return json;
}
