import { BigNumber } from "bignumber.js";

const TARGET = new BigNumber("3450000000000");
const ONE_BILLION = new BigNumber("1000000000");
const BASE = new BigNumber("3450");
const DISCOUNT_FACTOR = new BigNumber("0.99");

export const calculateUsdtShouldPay = (y: string): string => {
  const denominator = ONE_BILLION.minus(new BigNumber(y));
  const result = TARGET.dividedBy(denominator)
    .minus(BASE)
    .dividedBy(DISCOUNT_FACTOR);
  return result.toFixed();
};

export const calculateTokenReceive = (x: string): string => {
  const discountedX = new BigNumber(x).multipliedBy(DISCOUNT_FACTOR);
  const denominator = BASE.plus(discountedX);
  const result = ONE_BILLION.minus(TARGET.dividedBy(denominator));
  return result.toFixed();
};
