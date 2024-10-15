export const API_PATH = {
  AUTH: {
    CONNECT_WALLET: "/auth/connect-wallet",
  },
  UPLOAD_IMAGES: "/upload/images",
  USER: {
    UPDATE_PROFILE: "/user/update-profile",
    PROFILE: (walletAddress: string) => `/user/profile/${walletAddress}`,
    PORTFOLIO: "/user/coins-held",
    MY_REPLIES: "/user/my-replies",
    COINS_CREATED: "/user/coins-created",
    FOLLOWINGS: "/user/followings",
    FOLLOWERS: "/user/followers",
    NOTIFICATION: "/user/notification",
    FOLLOW_USER: "/user/follow-user",
    POST_COMMENT: "/user/post-comment",
    LIKE_COMMENT: "/user/like-comment",
  },
};
