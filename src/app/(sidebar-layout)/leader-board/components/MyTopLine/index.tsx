import { convertNumber, formatAmount } from "@/helpers/formatNumber";
import { StarTopIcon } from "@public/assets";
import Image from "next/image";

const MyTopLine = ({
  top,
  total,
}: {
  top: number | any;
  total: number | any;
}) => {
  return (
    <div className="flex flex-row items-center bg-[var(--color-primary-10)] justify-between sm:min-w-[280px] sm:max-w-[400px] h-[40px] w-full mb-4 sm:mb-0 rounded-full border border-primary-main text-14px-bold px-3 text-neutral-9">
      <div className="flex flex-row items-center">
        <Image src={StarTopIcon} alt="top-star" />
        <span className="ml-[10px]">
          My Rank: {top ? (Number(top) > 500 ? "500+" : top) : "-"}
        </span>
      </div>
      <span className="mr-2">
        Total Volume: {total ? formatAmount(convertNumber(total, 6)) : "-"}
      </span>
    </div>
  );
};

export default MyTopLine;
