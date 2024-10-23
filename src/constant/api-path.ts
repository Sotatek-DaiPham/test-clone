export const API_PATH = {
  AUTH: {
    CONNECT_WALLET: "/auth/connect-wallet",
  },
  UPLOAD_IMAGE: "/medias/image",
  USER: {
    UPDATE_PROFILE: "/user/update-profile",
    PROFILE: (walletAddress: string) => `/user/profile/${walletAddress}`,
    OTHER_PROFILE: (walletAddress: string) =>
      `/user/other-profile/${walletAddress}`,
    MY_REPLIES: "/user/my-replies",
    FOLLOWINGS: "/user/followings",
    FOLLOWERS: "/user/followers",
    NOTIFICATION: "/user/notification",
    FOLLOW_USER: (id: string) => `/user/follow-user/${id}`,
    POST_COMMENT: "/user/post-comment",
    LIKE_COMMENT: "/user/like-comment",
  },
  TOKEN: {
    LIST: "/token",
    CREATE_TOKEN: "/token",
    TOKEN_DETAIL: "/token/token-detail",
    KING_OF_THE_SKY: "/token/king-of-the-hill",
    FOLLOWING_TOKEN_CREATED: "/token/following-token-created",
    PORTFOLIO: "/token/token-held",
    COINS_CREATED: "/token/token-created",
    DISCUSSION_THREADS: "/token/discussion-threads",
    TRADE_HISTORY_SLIDER: "/token/token-trading-histories",
    TRADING_HISTORIES: "/token/token-trading-histories",
  },
  TRADING: {
    ACTIVITY: "/user-trading-histories/following",
  },
};
