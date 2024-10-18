"use client";
import AppButton from "@/components/app-button";
import AppTabs from "@/components/app-tabs";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import { HowItWorksIcon } from "@public/assets";
import Image from "next/image";
import { useEffect, useState } from "react";
import AllTab from "./_components/AllTab";
import FollowingTab from "./_components/FollowingTab";
import ProjectCard from "./_components/ProjectCard";

enum ETabsTerminal {
  ALL = "all",
  FOLLOWING = "following",
}

export default function Home() {
  const { searchParams, setSearchParams } = useAppSearchParams("terminal");
  const [activeTab, setActiveTab] = useState<string>(ETabsTerminal.ALL);
  const tabs = [
    {
      label: "All",
      key: ETabsTerminal.ALL,
      children: <AllTab />,
    },
    {
      label: "Following",
      key: ETabsTerminal.FOLLOWING,
      children: <FollowingTab />,
    },
  ];

  const handleChangeTab = (value: any) => {
    setActiveTab(value);
    setSearchParams({
      tab: value,
      filter: value === ETabsTerminal.ALL ? "trending" : "activity",
    });
  };

  useEffect(() => {
    if (searchParams.tab === ETabsTerminal.FOLLOWING) {
      setActiveTab(ETabsTerminal.FOLLOWING);
    }
    if (searchParams.tab === ETabsTerminal.ALL) {
      setActiveTab(ETabsTerminal.ALL);
    }
  }, []);

  return (
    <div className="h-full !m-[-24px]">
      <div className="m-auto p-6 max-w-[var(--width-content-sidebar-layout)]">
        <div className="grid grid-cols-2 gap-6">
          <div className="h-full grid grid-cols-3 rounded-3xl how-it-work-bg !overflow-hidden">
            <div className="col-span-2 h-full flex flex-col justify-between py-[40px]">
              <div className="h-full">
                <span className="text-32px-bold text-white-neutral">
                  RainPump
                </span>
                <div className="truncate-4-line my-2 text-white-neutral text-16px-normal">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Beatae ea perferendis ipsum quisquam excepturi quis sit libero
                  officia! Facere neque vitae quae deleniti in adipisci.
                  Recusandae, eligendi animi. Eius, provident!
                </div>
              </div>
              <AppButton
                typeButton="teriary"
                customClass="!rounded-3xl !w-fit !bg-white-neutral"
                classChildren="!text-neutral-1 !text-14px-bold p-6"
              >
                How it works?
              </AppButton>
            </div>
            <div className="col-span-1 relative">
              <Image
                src={HowItWorksIcon}
                alt="how-it-work"
                className="absolute !max-w-[125%] left-[-50px] bottom-0"
              />
            </div>
          </div>
          <div className="h-full">
            <div className="bg-neutral-2 rounded-3xl p-6">
              <span className="text-primary-main italic text-32px-bold flex w-full justify-center">
                King of The Sky
              </span>
              <ProjectCard
                className="p-0"
                data={{
                  address: "",
                  avatar: "",
                  title: "Project name",
                  percent: 55,
                  description:
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus doloribus dolorum minus vero molestias iste ullam perspiciatis, odio ipsum harum laudantium earum consequuntur nesciunt dolore sapiente error deleniti perferendis nulla!",
                  total: "5900000",
                  currentValue: "2123000",
                  stage: "S1",
                }}
              />
            </div>
          </div>
        </div>
        <div className="my-5">
          <AppTabs
            items={tabs}
            activeKey={activeTab}
            onChange={handleChangeTab}
          />
        </div>
      </div>
    </div>
  );
}
