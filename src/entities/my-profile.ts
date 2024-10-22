export interface MyProfileResponse {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  walletAddress: string;
  username: string;
  bio: any;
  avatar: any;
  status: string;
  likedReceived: number;
  mentionsReceived: number;
  numberFollower: number;
  isFollowing?: boolean;
}

export interface UpdateProfilePayload {
  username: string;
  bio?: string;
  avatar?: any;
}

export type TUpdateProfilePayload = {
  username: string;
  bio?: string;
  avatar?: any;
};

export interface IMyRepliesResponse {
  tokenId: number;
  replyId: number;
  replyUserId: number;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  userName: string;
  avatar: string;
  walletAddress: string;
}

export interface IFollowerResponse {
  id: number;
  wallet_address: string;
  username: string;
  bio: string;
  avatar: string;
  numberFollower: number;
  isFollowing: boolean;
}

export interface IProjectCardResponse {
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
  amount: string;
  price: string;
  symbol: string;
  numberTransaction: number;
  numberView: number;
  timeToListDex: number;
  volume: number;
  createAt: string;
}

export enum ETabsMyProfile {
  MY_PROFILE = "my-profile",
  PORTFOLIO = "portfolio",
  COIN_CREATED = "coin-created",
  FOLLOWERS = "followers",
  FOLLOWING = "following",
  MY_REPLIES = "my-replies",
}
