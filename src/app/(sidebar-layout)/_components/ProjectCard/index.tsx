import AppDivider from "@/components/app-divider";
import AppImage from "@/components/app-image";
import AppProgress from "@/components/app-progress";
import { formatAmount } from "@/helpers/formatNumber";
import { useRouter } from "next/navigation";

interface Project {
  address: string;
  title: string;
  percent: number;
  description: string;
  total: string;
  currentValue: string;
  stage?: string;
  avatar?: string;
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
      className={`p-4 pb-6 rounded-3xl bg-neutral-2 text-neutral-7 cursor-pointer ${
        className ?? ""
      }`}
      onClick={() => {
        router.push(`/token-detail/${data?.address}`);
      }}
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <AppImage
            className="!bg-neutral-4 w-full h-full rounded-3xl"
            src={data?.avatar}
            alt="avatar"
          />
        </div>
        <div className="col-span-2">
          <div>
            <span className="text-neutral-9 text-18px-bold capitalize">
              {data?.title || "-"}
            </span>
            <AppDivider />
          </div>
          <div className="truncate-3-line min-h-[65px]">
            {data?.description || "-"}
          </div>
        </div>
      </div>

      <div className="mt-3">
        {footer && footer}
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
        {!footer && (
          <AppProgress
            percent={data?.percent ?? 0}
            strokeColor="var(--color-primary-7)"
          />
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
