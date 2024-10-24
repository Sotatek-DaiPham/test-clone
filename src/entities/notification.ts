export interface INotificationResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  userId: number;
  title: string;
  description: any;
  information: Information;
}

export interface Information {
  walletAddress: string;
  avatar: string;
}
