import AppDivider from "@/components/app-divider";
import AppImage from "@/components/app-image";
import EllipsisTextWithTooltip from "@/components/app-tooltip/EllipsisTextWithTooltip";
import { PATH_ROUTER } from "@/constant/router";
import { convertNumber, formatAmount } from "@/helpers/formatNumber";
import { shortenAddress } from "@/helpers/shorten";
import useWindowSize from "@/hooks/useWindowSize";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  const { isMobile } = useWindowSize();
  const router = useRouter();
  return (
    <div className={`h-fit rounded-3xl p-[1px] pt-0 ${className ?? ""}`}>
      <div className="h-fit rounded-3xl border-primary-main bg-neutral-2 w-full text-center p-6">
        <div className="w-full mb-5 flex flex-row">
          <div className="sm:w-full w-fit">
            <Image
              src={image}
              alt="top-user"
              className={`m-auto ${isMobile ? "w-[56px]" : ""}`}
            />
            <div className="text-center mt-2 text-white-neutral">
              <AppImage
                src={data?.avatar}
                alt="avatar"
                className={`border overflow-hidden border-white-neutral flex m-auto [&>img]:!object-cover rounded-full bg-primary-7 ${
                  top1 && !isMobile
                    ? "!w-[120px] !h-[120px]"
                    : isMobile
                    ? "w-[56px] h-[56px]"
                    : "w-[80px] h-[80px]"
                }`}
              />
              {!isMobile && (
                <>
                  <div>
                    <EllipsisTextWithTooltip
                      value={data?.username || "-"}
                      className={`mt-4 text-white-neutral mb-1 ${
                        top1 ? "text-22px-bold" : "text-18px-bold"
                      }`}
                      width={200}
                    />
                  </div>
                  <p className="text-16px-normal text-neutral-7">
                    {shortenAddress(data?.walletAddress) || "-"}
                  </p>
                </>
              )}
            </div>
          </div>
          {isMobile && (
            <div className="text-white-neutral ml-4 text-left flex justify-end flex-col mb-2">
              <div>
                <EllipsisTextWithTooltip
                  value={data?.username || "-"}
                  className="mt-4 text-white-neutral mb-1 text-18px-bold"
                  width={200}
                />
                <p
                  className="text-14px-normal text-neutral-7 hover:underline"
                  onClick={() =>
                    router.push(PATH_ROUTER.USER_PROFILE(data?.walletAddress))
                  }
                >
                  {shortenAddress(data?.walletAddress) || "-"}
                </p>
              </div>
            </div>
          )}
        </div>
        <AppDivider />
        <div className="sm:grid sm:grid-cols-3 flex flex-col sm:gap-6 gap-2 text-neutral-7 text-14px-normal mt-4">
          <div className="w-full flex sm:flex-col flex-row items-center justify-between text-center">
            <span>Total</span>
            <span className="text-16px-medium text-white-neutral mt-1">
              {data?.total
                ? `${formatAmount(convertNumber(data?.total, 6))} USDT`
                : "-"}
            </span>
          </div>
          <div className="w-full flex sm:flex-col flex-row items-center justify-between text-center">
            <span>Buy</span>
            <span className="text-16px-medium text-success-main mt-1">
              {data?.buy
                ? `${formatAmount(convertNumber(data?.buy, 6))} USDT`
                : "-"}
            </span>
          </div>
          <div className="w-full flex sm:flex-col flex-row items-center justify-between text-center">
            <span>Sell</span>
            <span className="text-16px-medium text-error-main mt-1">
              {data?.sell
                ? `${formatAmount(convertNumber(data?.sell, 6))} USDT`
                : "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUser;
