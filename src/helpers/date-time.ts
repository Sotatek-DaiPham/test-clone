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
