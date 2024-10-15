import AppDivider from "@/components/app-divider";
import AppImage from "@/components/app-image";
import AppProgress from "@/components/app-progress";
import { useRouter } from "next/navigation";

interface Project {
  title: string;
  percent: number;
  description: string;
  total: number;
  currentValue: number;
  stage: string;
}

interface IProjectCardProps {
  data?: Project;
  className?: string;
}

const ProjectCard = ({ data, className }: IProjectCardProps) => {
  const router = useRouter();
  return (
    <div
      className={`p-4 pb-6 rounded-3xl bg-neutral-2 text-neutral-7 cursor-pointer ${
        className ?? ""
      }`}
      onClick={() => {
        router.push(`/token-detail/${data?.title}`);
      }}
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <AppImage className="!bg-neutral-4 w-full h-full rounded-3xl" />
        </div>
        <div className="col-span-2">
          <div>
            <span className="text-neutral-9 text-18px-bold">
              {data?.title ?? "-"}
            </span>
            <AppDivider />
          </div>
          <div className="truncate-3-line">{data?.description ?? "-"}</div>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex justify-between items-center mb-1 text-14px-normal">
          <span>Progress</span>
          <span className="text-14px-normal">
            <span className="text-primary-main mr-1">
              ({data?.percent ?? 0}%)
            </span>
            <span className="text-white-neutral">{`${data?.currentValue ?? 0}/${
              data?.total ?? 0
            } ${data?.stage}`}</span>
          </span>
        </div>
        <AppProgress
          percent={data?.percent ?? 0}
          strokeColor="var(--color-primary-7)"
        />
      </div>
    </div>
  );
};

export default ProjectCard;
