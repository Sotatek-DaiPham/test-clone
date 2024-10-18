import AppDivider from "@/components/app-divider";
import AppImage from "@/components/app-image";
import AppProgress from "@/components/app-progress";
import {
  convertNumber,
  formatAmount,
  nFormatter,
} from "@/helpers/formatNumber";
import { useRouter } from "next/navigation";
import "./styles.scss";
import { shortenAddress } from "@/helpers/shorten";
import { CalendarIcon, SwapIcon } from "@public/assets";
import Image from "next/image";
interface Project {
  id: number;
  logo: string;
  address: string;
  title: string;
  percent: number;
  description: string;
  total: string;
  currentValue: string;
  stage?: string;
  owner?: string;
}

interface IProjectCardProps {
  data?: Project;
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
          <AppImage
            className="!bg-neutral-4 w-full h-full rounded-3xl overflow-hidden flex"
            src={data?.logo}
            alt="logo"
          />
        </div>
        <div className="col-span-2">
          <div>
            {!footer && (
              <div className="text-primary-7 text-12px-normal">
                Create by {data?.owner ? shortenAddress(data?.owner) : "-"}
              </div>
            )}
            <div className="text-neutral-9 text-18px-bold capitalize truncate-1-line">
              {data?.title || "-"}
            </div>
            <AppDivider />
          </div>
          <div className="truncate-3-line min-h-[65px]">
            {data?.description || "-"}
          </div>
        </div>
      </div>
      {footer ? (
        <div className="mt-3">
          <div className="text-14px-normal text-neutral-7">
            <div className="mt-2 flex justify-between">
              <span>Total hold</span>
              <span>
                <span className="text-primary-main mr-2">
                  {data?.currentValue
                    ? formatAmount(convertNumber(data?.currentValue))
                    : "-"}
                </span>
                <span className="text-white-neutral capitalize">
                  {data?.title || "-"}
                </span>
              </span>
            </div>
            <div className="my-2 flex justify-between">
              <span>Value</span>
              <span>
                <span className="text-primary-main mr-2">
                  {nFormatter("12")}
                </span>
                <span className="text-white-neutral uppercase">USDT</span>
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center mb-1 text-14px-normal">
            <span>Progress</span>
            <span className="text-14px-normal">
              <span className="text-primary-main mr-2">
                ({formatAmount(data?.percent || "0")}%)
              </span>
              {data?.stage ? (
                <span className="text-white-neutral capitalize">
                  {data?.stage}
                </span>
              ) : (
                <span className="text-white-neutral">{`${formatAmount(
                  data?.currentValue || "0"
                )}/${formatAmount(data?.total || "0")}`}</span>
              )}
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1 text-14px-normal text-white-neutral">
            <div className="text-14px-bold flex flex-row items-center">
              <span className="text-primary-7 mr-1">
                {formatAmount(data?.percent || 0)}%
              </span>
              <span>${nFormatter(data?.currentValue || "0")}</span>
            </div>
            <div className="flex flex-row items-center">
              <Image src={CalendarIcon} alt="calender-icon" />
              <span>1d</span>
              <Image src={SwapIcon} alt="swap-icon" className="mx-1" />
              <span>1,610</span>
              <span className="mx-1">txns</span>
              <span>/ $78k vol</span>
            </div>
          </div>
          <AppProgress
            percent={data?.percent ?? 0}
            strokeColor="var(--color-primary-7)"
          />
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
