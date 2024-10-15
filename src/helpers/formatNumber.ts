import BigNumber from "bignumber.js";

type IBigNumberArg = string | number | BigNumber;

export const formatNumberWithComma = (value: string) => {
  const parts = value?.split(".");
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const formattedNumber =
    parts.length > 1 ? integerPart + "." + parts[1] : integerPart;
  return formattedNumber;
};

export const nFormatter = (
  number: string,
  digits = 2,
  roundingMode?: BigNumber.RoundingMode
) => {
  if (!number) {
    return "";
  }

  const SI = [
    { value: 1, symbol: "" },
    // { value: 1e3, symbol: 'K' }, // Follow common rule CMR-01.5
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "q" },
    { value: 1e18, symbol: "Q" },
    { value: 1e21, symbol: "s" },
    { value: 1e24, symbol: "S" },
  ];
  // |(\.[0-9]*[1-9])0+$
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const num = parseFloat(number);

  let i;
  for (i = SI.length - 1; i > 0; i--) {
    if (num >= SI[i].value) {
      break;
    }
  }

  const roundingModeCombined = roundingMode || BigNumber.ROUND_HALF_UP;

  const minimumNumber = BigNumber(1).div(`1e${digits}`).toNumber();

  if (Number(number) > 0 && new BigNumber(number).lt(minimumNumber)) {
    return "< " + parseFloat(minimumNumber?.toExponential()).toFixed(digits);
  }

  const formatedValue =
    new BigNumber(num)
      .div(SI[i].value)
      .toFixed(digits, roundingModeCombined)
      .toString()
      .replace(rx, "$1") + SI[i].symbol;

  return formatNumberWithComma(formatedValue);
};

export const formatRoundFloorDisplayWithCompare = (
  value: IBigNumberArg,
  decimalPlace = 4
): string => {
  const minimumNumber = BigNumber(1).div(`1e${decimalPlace}`).toNumber();
  const data = String(
    new BigNumber(value).toNumber().toLocaleString("en-US", {
      maximumFractionDigits: decimalPlace,
      minimumFractionDigits: 0,
    })
  ).replaceAll(",", "");

  if (Number(value) !== 0 && new BigNumber(value).lt(minimumNumber)) {
    return "<" + minimumNumber;
  }
  return data;
};

export const formatAmount = (
  value: string | number | BigNumber,
  decimalPlace = 2,
  shiftedBy = 0
): string => {
  if (Number(value) !== 0 && new BigNumber(value).lt(0.01)) {
    return "<0.01";
  }
  return new BigNumber(value || 0)
    .shiftedBy(-shiftedBy)
    .decimalPlaces(decimalPlace, BigNumber.ROUND_DOWN)
    .toFormat();
};

export const formatAmountWithDecimal = (
  value: string | number | BigNumber,
  decimalPlace = 2,
  shiftedBy = 0
): string => {
  if (Number(value) !== 0 && new BigNumber(value).lt(0.01)) {
    return "<0.01";
  }
  return new BigNumber(value || 0)
    .shiftedBy(-shiftedBy)
    .decimalPlaces(decimalPlace, BigNumber.ROUND_DOWN)
    .toFormat(decimalPlace);
};
