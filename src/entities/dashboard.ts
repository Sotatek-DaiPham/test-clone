export interface ITokenDashboardResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  contractAddress: string;
  idx: string;
  symbol: string;
  name: string;
  description: string;
  avatar: string;
  tokenFactory: string;
  decimal: number;
  total_supply: string;
  owner: string;
  timestampCreated: string;
  initUsdtReserve: string;
  kingOfTheHillDate: string;
  website: string;
  twitter: string;
  telegram: string;
  discord: string;
  devWallet: string;
  isListedOnDex: boolean;
  timeToListDex: string;
  pairListDex: string;
  progressToListDex: number;
}

export interface IKingOfTheSkyResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  contractAddress: string;
  idx: string;
  symbol: string;
  name: string;
  description: string;
  avatar: string;
  tokenFactory: string;
  decimal: number;
  total_supply: string;
  owner: string;
  timestampCreated: string;
  initUsdtReserve: string;
  kingOfTheHillDate: string;
  website: string;
  twitter: string;
  telegram: string;
  discord: string;
  devWallet: string;
  isListedOnDex: boolean;
  timeToListDex: string;
  pairListDex: string;
  progressToListDex: number;
  user: User;
}

export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  walletAddress: string;
  username: string;
  bio: string;
  avatar: string;
  status: string;
}
