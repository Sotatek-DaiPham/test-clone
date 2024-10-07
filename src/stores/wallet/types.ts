export interface Token {
  contractAddress: string;
  balance: string | null;
  decimal: number;
  chainId: number;
  name: string;
  symbol: string;
  data: ExchangeRate | null;
  id: number;
}

export interface ParamsCoingecko {
  ids: string;
  vs_currencies: string;
}

export interface ExchangeRate {
  usd: string;
}

export interface PayloadCurrency {
  id: number;
  name: string;
  symbol: string;
  contractAddress: string;
  chainId: number;
  data: ExchangeRate | null;
}
