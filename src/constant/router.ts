export const PATH_ROUTER = {
  DASHBOARD: "/en/rain-pump",
  MY_PROFILE: "/en/rain-pump/my-profile",
  NOTIFICATION: "/en/rain-pump/notification",
  MY_TOKENS: "/en/rain-pump/my-tokens",
  LEADER_BOARD: "/en/rain-pump/leader-board",
  TOKEN_DETAIL: (id: any) => `/en/rain-pump/token-detail/${id}`,
  CREATE_TOKEN: "/en/rain-pump/create-token",
  USER_PROFILE: (address: any) => `/en/rain-pump/user/${address}`,
};
