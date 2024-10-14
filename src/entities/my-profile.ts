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
}
