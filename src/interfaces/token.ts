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
