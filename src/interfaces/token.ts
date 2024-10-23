export interface ICreateTokenReq {
  symbol: string;
  name: string;
  description: string;
  avatar?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
}

export interface ICreateTokenRes {
  idx: string;
  symbol: string;
  name: string;
  tokenFactory: string;
  total_supply: string;
  owner: string;
  initUsdtReserve: string;
  website: string;
  twitter: string;
  telegram: string;
  discord: string;
  createdAt: string;
  updatedAt: string;
  contractAddress: string | null;
  description: string | null;
  avatar: string | null;
  id: number;
  decimal: number;
}

export enum ECoinType {
  MemeCoin = "MemeCoin",
  StableCoin = "StableCoin",
}

export interface ITokenDetailRes {
  avatar: string;
  contractAddress: string;
  createdAt: string | null;
  decimal: number;
  description: string;
  discord: string | null;
  id: number;
  idx: string;
  kingOfTheHillDate: string;
  name: string;
  numberTransaction: string;
  pairListDex: string | null;
  price: string;
  progressToListDex: number;
  symbol: string;
  telegram: string | null;
  timeToListDex: string | null;
  total_supply: string;
  twitter: string | null;
  userAvatar: string | null;
  userWalletAddress: string;
  username: string;
  volume: string;
  website: string | null;
}

export interface TokenDetailSC {
  symbol: string;
  tokenVirtualReserve: string;
  usdtVirtualReserve: string;
  isListed: boolean;
  tokensSold: string;
  usdtRaised: string;
  id: string;
  devWallet: string;
}

export interface ITradeHistoryRes {
  user_address: string;
  token_address: string;
  amount: string;
  usdt_amount: string;
  action: string;
  created_at: string;
  updated_at: string;
  username: string;
  user_avatar: string | null;
}

export interface IGetTradeHistoryParams {
  orderBy?: string;
  direction?: string;
  page?: number;
  limit?: number;
  tokenAddress?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}
