export const ErrorCode = {
  MetamaskDeniedTx: "ACTION_REJECTED",
  INSUFFICIENT_FEE: -32603,
  SLIPPAGE_ERROR: "Pump: INSUFFICIENT_OUTPUT_AMOUNT",
  TOKEN_ALREADY_MINTED: "Pump: ID already exists",
  TRANSACTION_REVERTED: "execution reverted (unknown custom error)",
};

export const LIMIT_ITEMS_TABLE = 10;
export const LIMIT_COIN_ITEMS_TABLE = 100;

export const MINIMUM_BUY_AMOUNT = 0.1;

export const DECIMAL_USDT = 6;

export const USDT_DECIMAL = 1e6;

export const TOKEN_DECIMAL = 1e18;

export const USDT_THRESHOLD = 12000;

export const USDT_THRESHOLD_FOR_BUY_EXACT_IN = 13000;

export const PREDEFINE_AMOUNT = ["05", "10", "20", "50", "100"];

export const PREDEFINE_SELL_PERCENT = ["10%", "25%", "50%", "75%", "100%"];

export const PREDEFINE_SLIPPAGE = ["05", "10", "15", "20", "25"];

export const PREDEFINE_PRIORITY_FEE = [
  "0.001",
  "0.002",
  "0.003",
  "0.004",
  "0.005",
];

export const AMOUNT_FIELD_NAME = "amount";

export const ACCEPT_IMAGE_EXTENSION = ".png,.jpg,.jpeg,.gif";

export enum ETradeAction {
  BUY = "BUY",
  SELL = "SELL",
}

export enum EDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export const DEFAULT_AVATAR =
  "https://nft-ticket-the-bucket.s3.ap-southeast-1.amazonaws.com/images/d76403890c-image.png";

export enum EEventNoti {
  TOKEN_CREATED = "TokenCreated",
  BUY = "Buy",
  SELL = "Sell",
  TOKEN_LISTED = "TokenListed",
}
