import { BigNumber } from "bignumber.js";
import dayjs from "dayjs";
import { Dayjs } from "dayjs";
type DateType = string | number | Date | Dayjs;

declare module "dayjs" {
  interface Dayjs {
    fromNow(withoutSuffix?: boolean): string;
    from(compared: DateType, withoutSuffix?: boolean): string;
    toNow(withoutSuffix?: boolean): string;
    calendar(withoutSuffix?: boolean): string;
    to(compared: DateType, withoutSuffix?: boolean): string;
  }
}

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

export const countAgeToken = (createdAt: any): string => {
  const data = dayjs(new Date());
  const diffMinute = data.diff(
    dayjs(createdAt).format("YYYY-MM-DD HH:mm"),
    "minute"
  );
  const diffHour = data.diff(
    dayjs(createdAt).format("YYYY-MM-DD HH:mm"),
    "hour"
  );
  const diffDay = data.diff(dayjs(createdAt).format("YYYY-MM-DD HH:mm"), "day");
  const diffMonth = data.diff(
    dayjs(createdAt).format("YYYY-MM-DD HH:mm"),
    "month"
  );
  if (Math.floor(diffMonth) > 0) {
    return `${Math.floor(diffMonth)}mo`;
  }
  if (Math.floor(diffDay) > 0) {
    return `${Math.floor(diffDay)}d`;
  }
  if (Math.floor(diffHour) > 0) {
    return `${Math.floor(diffHour)}h`;
  }
  return `${Math.floor(diffMinute) || 1}m`;
};

export const increaseByPercent = (
  originalValue: string,
  percentIncrease: string
): string => {
  const original = new BigNumber(originalValue);
  const increase = new BigNumber(percentIncrease);

  if (increase.isNegative()) {
    throw new Error("Percent increase cannot be negative.");
  }

  const factor = BigNumber(1).plus(increase.div(100));
  return original.multipliedBy(factor).toString();
};

export const decreaseByPercent = (
  originalValue: string,
  percentDecrease: string
): string => {
  const original = new BigNumber(originalValue);
  const decrease = new BigNumber(percentDecrease);

  if (decrease.isNegative() || decrease.gt(100)) {
    throw new Error("Percent decrease must be between 0 and 100.");
  }

  const factor = new BigNumber(1).minus(decrease.div(100));
  return original.multipliedBy(factor).toString();
};
