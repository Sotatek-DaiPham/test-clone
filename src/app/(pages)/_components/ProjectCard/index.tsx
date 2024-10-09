import AppImage from "@/components/app-image";
import AppProgress from "@/components/app-progress";
import { Divider } from "antd";
import React from "react";

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
}

const ProjectCard = ({ data }: IProjectCardProps) => {
  return (
    <div className="p-4 pb-6 rounded-2xl bg-[#252935CC] text-[#777E90]">
      <div className="grid grid-cols-3">
        <div className="col-span-1">
          <AppImage className="bg-red-300" />
        </div>
        <div className="col-span-2">
          <div>
            <span className="text-white text-18px-bold">
              {data?.title ?? "-"}
            </span>
            <Divider style={{ borderColor: "#353945", margin: "10px 0" }} />
          </div>
          <div className="truncate-4-line">{data?.description ?? "-"}</div>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex justify-between mb-1">
          <span>Progress</span>
          <span className="text-12px-medium">
            <span className="text-[#55E3BE] mr-1">({data?.percent ?? 0})</span>
            <span className="text-white">{`${data?.currentValue ?? 0}/${
              data?.total ?? 0
            } ${data?.stage}`}</span>
          </span>
        </div>
        <AppProgress
          percent={data?.percent ?? 0}
          strokeWidth={8}
          showInfo={false}
          strokeColor="#55E3BE"
          trailColor="#353945"
          percentPosition={{ align: "end", type: "outer" }}
        />
      </div>
    </div>
  );
};

export default ProjectCard;
