export const ErrorCode = {
  MetamaskDeniedTx: "ACTION_REJECTED",
  INSUFFICIENT_FEE: -32603,
};

export const LIMIT_ITEMS_TABLE = 9;

export const MINIMUM_BUY_AMOUNT = 0.1;

export const DECIMAL_USDT = 6;

export const USDT_DECIMAL = 1e6;

export const TOKEN_DECIMAL = 1e18;

export const USDT_THRESHOLD = 12000;

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

export enum ETradeAction {
  BUY = "BUY",
  SELL = "SELL",
}
