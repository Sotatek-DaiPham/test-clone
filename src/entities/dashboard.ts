export interface ITokenDashboardResponse {
  id: number;
  contractAddress: string;
  name: string;
  description: string;
  avatar: string;
  decimal: number;
  total_supply: string;
  timestampCreated: null;
  progressToListDex: number;
  timeToListDex: null;
  userWalletAddress: string;
  userAvatar: null;
  username: string;
  numberView: string;
  rate: string;
  volume: string;
  numberTransaction: string;
  createdAt: string;
}

export interface IKingOfTheSkyResponse {
  id: number;
  contractAddress: string;
  name: string;
  description: string;
  avatar: string;
  decimal: number;
  total_supply: string;
  userAvatar: null;
  username: string;
  userWalletAddress: string;
  progressToListDex: number;
  volume: string;
  numberTransaction: string;
  createdAt: string;
}
