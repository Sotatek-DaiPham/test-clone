import { BigNumber } from "bignumber.js";
import dayjs from "dayjs";

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
