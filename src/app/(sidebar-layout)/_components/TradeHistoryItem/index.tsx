import AppImage from "@/components/app-image";
import AppTooltip from "@/components/app-tooltip";
import AppTruncateText from "@/components/app-truncate-text";
import { PATH_ROUTER } from "@/constant/router";
import { ITradeHistoryResponse } from "@/entities/dashboard";
import { convertNumber, formatAmount } from "@/helpers/formatNumber";
import { shortenAddress } from "@/helpers/shorten";
import { useRouter } from "next/navigation";
import React from "react";

const TradeHistoryItem = ({ item }: { item: ITradeHistoryResponse }) => {
  const router = useRouter();
  return (
    <div className="flex flex-row items-center text-14px-normal text-neutral-9 border-r border-neutral-4 px-3">
      <AppTooltip title={item?.user_address}>
        <span
          className="mr-2 cursor-pointer hover:!underline"
          onClick={(e) => {
            e.stopPropagation();
            router.push(PATH_ROUTER.USER_PROFILE(item?.user_address));
          }}
        >
          {shortenAddress(item?.user_address)}
        </span>
      </AppTooltip>
      <span
        className={
          item?.action === "BUY" ? "text-success-main" : "text-error-main"
        }
      >
        {item?.action === "BUY"
          ? "Bought"
          : item?.action === "SELL"
          ? "Sold"
          : "-"}
      </span>
      <span className="mx-1 ml-2">
        {formatAmount(convertNumber(item?.amount, item?.decimal)) || "-"}
      </span>
      <span className="text-14px-normal">of</span>
      <AppImage
        src={item?.token_avatar}
        alt="logo"
        className="!w-[24px] !h-[24px] rounded-full flex justify-center items-center mx-3"
      />
      <span className="text-14px-bold text-primary-6 hover:underline">
        <AppTruncateText text={item?.token_name} maxLength={5} />
      </span>
    </div>
  );
};

export default TradeHistoryItem;
