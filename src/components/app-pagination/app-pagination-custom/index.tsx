import AppButton from "@/components/app-button";
import ShowingPage from "@/components/showing-page";
import { formatAmount } from "@/helpers/formatNumber";
import { ArrowRightIcon } from "@public/assets";
import Image from "next/image";

const AppPaginationCustom = ({
  total = 0,
  page = 0,
  limit = 0,
  label = "",
  position = "end",
  hideOnSinglePage = false,
  onChange,
}: {
  total: number;
  page: number;
  limit: number;
  label?: string;
  position?: "start" | "center" | "end";
  onChange: (page: number, limit?: number) => void;
  hideOnSinglePage?: boolean;
}) => {
  const range = [
    limit * (page - 1) + (page === 1 ? 0 : 1) || 1,
    limit * page > total ? total : page * limit,
  ];
  return total <= limit && hideOnSinglePage ? null : (
    <div
      className={`flex flex-row items-center gap-4 w-full justify-${position}`}
    >
      <ShowingPage total={total} range={range} label={label} />
      {page > 1 && (
        <AppButton
          typeButton="outline"
          onClick={() => onChange(page - 1)}
          customClass="!rounded-lg !w-fit !min-w-[120px] !text-center"
          classChildren="!flex !flex-row !items-center !justify-center"
          widthFull={true}
        >
          <Image
            src={ArrowRightIcon}
            alt="prev"
            className="w-[16px] h-[16px] rotate-180"
          />
          <span className="ml-2 text-neutral-9">
            {page < 3
              ? `1-${formatAmount(limit)}`
              : `${formatAmount(
                  limit * (page - 2) + (page === 1 ? 0 : 1)
                )}-${formatAmount(limit * (page - 1))}`}
          </span>
        </AppButton>
      )}
      {page * limit < total && (
        <AppButton
          typeButton="outline"
          widthFull={true}
          customClass="!rounded-lg !w-fit !min-w-[120px]"
          classChildren="!flex !flex-row !items-center !justify-center"
          onClick={() => onChange(page + 1)}
        >
          <span className="mr-2 text-neutral-9">
            {page > 1
              ? `${formatAmount(
                  limit * page + (page === 1 ? 0 : 1)
                )}-${formatAmount(
                  limit * (page + 1) > total ? total : limit * (page + 1)
                )}`
              : `${formatAmount(limit * (page - 1) + 1)}-${formatAmount(
                  limit * (page + 1)
                )}`}
          </span>
          <Image
            src={ArrowRightIcon}
            alt="next"
            className="w-[16px] h-[16px]"
          />
        </AppButton>
      )}
    </div>
  );
};

export default AppPaginationCustom;
