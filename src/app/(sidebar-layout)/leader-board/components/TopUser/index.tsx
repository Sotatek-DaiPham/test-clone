import AppDivider from "@/components/app-divider";
import AppImage from "@/components/app-image";
import { formatAmount } from "@/helpers/formatNumber";
import { shortenAddress } from "@/helpers/shorten";
import Image from "next/image";
import React from "react";

const TopUser = ({
  data,
  className,
  image,
  top1 = false,
}: {
  data?: any;
  className?: string;
  image: any;
  top1?: boolean;
}) => {
  return (
    <div className={`h-fit rounded-3xl p-[1px] pt-0 ${className ?? ""}`}>
      <div className="h-fit rounded-3xl border-primary-main bg-neutral-2 w-full text-center p-6">
        <div className="w-full mb-5">
          <Image src={image} alt="top-user" className="m-auto" />
          <div className="text-center mt-2 text-white-neutral">
            <AppImage
              src={data?.avatar}
              alt="avatar"
              className={`border overflow-hidden border-white-neutral rounded-full bg-primary-7 ${
                top1 ? "!w-[120px] !h-[120px]" : "w-[80px] h-[80px]"
              }`}
            />
            <p
              className={`mt-4 mb-1 ${
                top1 ? "text-22px-bold" : "text-18px-bold"
              }`}
            >
              {data?.username || "-"}
            </p>
            <p className="text-16px-normal text-neutral-7">
              {shortenAddress(data?.address) || "-"}
            </p>
          </div>
        </div>
        <AppDivider />
        <div className="grid grid-cols-3 gap-6 text-neutral-7 text-14px-normal mt-4">
          <div className="w-full flex flex-col text-center">
            <span>Total</span>
            <span className="text-16px-medium text-white-neutral mt-1">
              {data?.total ? `${formatAmount(data?.total)} USDT` : "-"}
            </span>
          </div>
          <div className="w-full flex flex-col text-center">
            <span>Buy</span>
            <span className="text-16px-medium text-success-main mt-1">
              {data?.buy ? `${formatAmount(data?.buy)} USDT` : "-"}
            </span>
          </div>
          <div className="w-full flex flex-col text-center">
            <span>Sell</span>
            <span className="text-16px-medium text-error-main mt-1">
              {data?.sell ? `${formatAmount(data?.sell)} USDT` : "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUser;
