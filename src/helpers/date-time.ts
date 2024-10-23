import { DATE_TIME_FORMAT, DATE_TIME_SECONDS_FORMAT } from "@/constant/format";
import dayjs from "dayjs";

export const getTimeDDMMMYYYYHHMM = (date: string | null) => {
  if (!dayjs(date).isValid()) {
    return "-";
  }

  return dayjs(date).format(DATE_TIME_FORMAT);
};

export const getTimeDDMMMYYYYHHMMss = (date: string | null) => {
  if (!dayjs(date).isValid()) {
    return "-";
  }

  return dayjs(date).format(DATE_TIME_SECONDS_FORMAT);
};

const getAgeMilliseconds = (interval: string): number => {
  const stringIntervals: { [key: string]: number } = {
    "1H": 60,
    "3H": 3 * 60,
    "6H": 6 * 60,
    "12H": 12 * 60,
    "24H": 24 * 60,
    "1D": 24 * 60,
    "3D": 3 * 24 * 60,
  };
  if (stringIntervals[interval]) {
    return stringIntervals[interval] * 60 * 1000;
  } else {
    return Number(interval?.replace("M", "")) * 1000;
  }
};

export const getAge = (age: string | undefined, type: string) => {
  console.log("age", age);
  if (!age) return "";
  if (age.includes(type)) {
    const newAge = age?.replace(type, "");
    return getAgeMilliseconds(newAge)?.toString();
  }
  return "";
};
