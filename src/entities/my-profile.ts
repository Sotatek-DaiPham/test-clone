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
  isFollow?: boolean;
}
export interface PortfolioResponse {
  contract_address: string;
  amount: string;
  title: string;
  description: string;
  avatar: string;
  decimal: number;
  total_supply: string;
  timestamp_created: number;
  created_at: string;
  updated_at: string;
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
// & TDefaultGetParams;
