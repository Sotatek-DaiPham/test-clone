export interface INotificationResponse {
  id: number;
  createdAt: Date;
  updatedAt: Date;
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
