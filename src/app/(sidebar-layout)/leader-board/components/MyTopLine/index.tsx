import { convertNumber, nFormatter } from "@/helpers/formatNumber";
import { StarTopIcon } from "@public/assets";
import Image from "next/image";

const showTop = (data: any) => {
  if (!data.top) {
    return "NaN";
  } else if (Number(data.latestTimestamp) > Number(data.unixTimestamp)) {
    return "500+";
  } else if (data.top) {
    return data?.top;
  } else return "-";
};
const showTotal = (data: any) => {
  if (!data.top) {
    return "0";
  } else if (Number(data.latestTimestamp) > Number(data.unixTimestamp)) {
    return nFormatter(convertNumber(data?.total, 6), 2);
  } else if (data.top) {
    return nFormatter(convertNumber(data?.total, 6), 2);
  } else return "-";
};

const MyTopLine = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-row items-center bg-[var(--color-primary-10)] justify-between sm:min-w-[280px] sm:max-w-[400px] h-[40px] w-full mb-4 sm:mb-0 rounded-full border border-primary-main text-14px-bold px-3 text-neutral-9">
      <div className="flex flex-row items-center">
        <Image src={StarTopIcon} alt="top-star" />
        <span className="ml-[10px]">My Rank: {showTop(data)}</span>
      </div>
      <span className="mr-2">Total Volume: {showTotal(data)}</span>
    </div>
  );
};

export default MyTopLine;
