import AppDivider from "@/components/app-divider";
import AppImage from "@/components/app-image";
import AppProgress from "@/components/app-progress";
import { DECIMAL_USDT, DEFAULT_AVATAR } from "@/constant";
import { countAgeToken } from "@/helpers/calculate";
import {
  convertNumber,
  formatAmount,
  nFormatter,
} from "@/helpers/formatNumber";
import { CalendarIcon, ImageDefaultIcon, SwapIcon } from "@public/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./styles.scss";

interface IProjectCardProps {
  data: any;
  className?: string;
  footer?: React.ReactNode;
}

const ProjectCard = ({ data, className, footer }: IProjectCardProps) => {
  const router = useRouter();
  return (
    <div
      className={`animate-bg-opacity p-4 pb-6 rounded-3xl bg-neutral-2 text-neutral-7 cursor-pointer ${
        className ?? ""
      }`}
      onClick={() => {
        router.push(`/token-detail/${data?.id}`);
      }}
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          {data?.avatar ? (
            <AppImage
              className="!bg-neutral-4 w-full h-full rounded-3xl overflow-hidden flex [&>img]:!object-cover"
              src={data?.avatar || DEFAULT_AVATAR}
              alt="logo"
            />
          ) : (
            <div className="!w-full !h-full !bg-neutral-4 !rounded-3xl flex justify-center overflow-hidden">
              <Image
                className="!bg-neutral-4 [&>img]:!object-cover"
                alt="logo"
                src={ImageDefaultIcon}
              />
            </div>
          )}
        </div>
        <div className="col-span-2">
          <div>
            {!footer && (
              <div className="text-primary-7 text-12px-normal">
                Create by {data?.username || "-"}
              </div>
            )}
            <div className="text-neutral-9 text-18px-bold capitalize truncate-1-line">
              {data?.name || "-"}
            </div>
            <AppDivider />
          </div>
          <div className="truncate-3-line min-h-[65px]">
            {data?.description || "-"}
          </div>
        </div>
      </div>
      {footer && (
        <div className="mt-3">
          <div className="text-14px-normal text-neutral-7">
            <div className="mt-2 flex justify-between">
              <span>Total hold</span>
              <span>
                <span className="text-primary-main mr-2">
                  {data?.amount
                    ? formatAmount(convertNumber(data?.amount, data?.decimal))
                    : "-"}
                </span>
                <span className="text-white-neutral capitalize">
                  {data?.symbol || "-"}
                </span>
              </span>
            </div>
            <div className="my-2 flex justify-between">
              <span>Value</span>
              <span>
                <span
                  className={
                    data?.price
                      ? "text-primary-main mr-2"
                      : "text-white-neutral mr-2"
                  }
                >
                  {nFormatter(data?.price) || "-"}
                </span>
                <span className="text-white-neutral uppercase">USDT</span>
              </span>
            </div>
          </div>
        </div>
      )}
      <div className="mt-3">
        <div className="flex justify-between items-center mb-1 text-14px-normal text-white-neutral">
          <div className="text-14px-bold flex flex-row items-center">
            <span className="text-primary-7 mr-1">
              {formatAmount(data?.progressToListDex || 0)}%
            </span>
            <span>${nFormatter(12000)}</span>
          </div>
          <div className="flex flex-row items-center">
            <Image src={CalendarIcon} alt="calender-icon" />
            <span>{countAgeToken(data?.createdAt) || "-"}</span>
            <Image src={SwapIcon} alt="swap-icon" className="mx-1" />
            <span>{formatAmount(data?.numberTransaction) || 0}</span>
            <span className="mx-1">txns</span>
            <span>
              /
              {data?.progressToListDex === 100 ? (
                <span className="ml-1">Listed</span>
              ) : (
                <span className="ml-1">
                  ${nFormatter(convertNumber(data?.volume, DECIMAL_USDT)) || 0}{" "}
                  vol
                </span>
              )}
            </span>
          </div>
        </div>
        <AppProgress
          percent={data?.progressToListDex ?? 0}
          strokeColor="var(--color-primary-7)"
        />
      </div>
    </div>
  );
};

export default ProjectCard;
