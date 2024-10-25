"use client";
import AppButton from "@/components/app-button";
import AppImage from "@/components/app-image";
import AppTabs from "@/components/app-tabs";
import { API_PATH } from "@/constant/api-path";
import {
  IKingOfTheSkyResponse,
  ITradeHistoryResponse,
} from "@/entities/dashboard";
import { BeSuccessResponse } from "@/entities/response";
import { convertNumber, formatAmount } from "@/helpers/formatNumber";
import { shortenAddress } from "@/helpers/shorten";
import { useAppSearchParams } from "@/hooks/useAppSearchParams";
import useWalletAuth from "@/hooks/useWalletAuth";
import { getAPI } from "@/service";
import { HowItWorksIcon } from "@public/assets";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import get from "lodash/get";
import Image from "next/image";
import { useEffect, useState } from "react";
import AllTab from "./_components/AllTab";
import FollowingTab from "./_components/FollowingTab";
import ProjectCard from "./_components/ProjectCard";
import AppTooltip from "@/components/app-tooltip";
import { EDirection } from "@/constant";
import useSocket from "@/hooks/useSocket";
import { ESocketEvent } from "@/libs/socket/constants";
import { useRouter } from "next/navigation";
import { PATH_ROUTER } from "@/constant/router";
import AppTruncateText from "@/components/app-truncate-text";

enum ETabsTerminal {
  ALL = "all",
  FOLLOWING = "following",
}

export default function Home() {
  const { addEvent, isConnected, removeEvent } = useSocket();
  const { accessToken } = useWalletAuth();
  const { searchParams, setSearchParams } = useAppSearchParams("terminal");
  const [activeTab, setActiveTab] = useState<string>(ETabsTerminal.ALL);
  const router = useRouter();

  const { data, refetch } = useQuery({
    queryKey: ["king-of-the-sky"],
    queryFn: async () => {
      return getAPI(API_PATH.TOKEN.KING_OF_THE_SKY) as Promise<
        AxiosResponse<BeSuccessResponse<IKingOfTheSkyResponse>, any>
      >;
    },
  });

  const kingOfTheSky = get(data, "data.data", {}) as IKingOfTheSkyResponse;

  const {
    data: dataTrade,
    isPending,
    refetch: refetchTrade,
  } = useQuery({
    queryKey: ["trade-history"],
    queryFn: async () => {
      return getAPI(API_PATH.TOKEN.TRADE_HISTORY_SLIDER, {
        params: {
          orderBy: "created_at",
          direction: EDirection.ASC,
          page: 1,
          limit: 14,
        },
      }) as Promise<
        AxiosResponse<BeSuccessResponse<ITradeHistoryResponse[]>, any>
      >;
    },
  });

  const tradeHistory = get(
    dataTrade,
    "data.data",
    []
  ) as ITradeHistoryResponse[];

  const tabs: any = [
    {
      label: "All",
      key: ETabsTerminal.ALL,
      children: <AllTab />,
    },
    accessToken
      ? {
          label: "Following",
          key: ETabsTerminal.FOLLOWING,
          children: <FollowingTab />,
        }
      : {},
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

  useEffect(() => {
    if (isConnected) {
      addEvent(ESocketEvent.BUY, (data) => {
        if (data) {
          refetchTrade();
        }
      });
      addEvent(ESocketEvent.SELL, (data) => {
        if (data) {
          refetchTrade();
        }
      });
      addEvent(ESocketEvent.CHANGE_KING_OF_THE_HILL, (data) => {
        if (data) {
          refetch();
        }
      });
    }
    return () => {
      removeEvent(ESocketEvent.BUY);
      removeEvent(ESocketEvent.SELL);
      removeEvent(ESocketEvent.CHANGE_KING_OF_THE_HILL);
    };
  }, [isConnected]);

  return (
    <div className="h-full !m-[-24px]">
      <div className="m-auto p-6 max-w-[var(--width-content-sidebar-layout)]">
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
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
            <div className="bg-neutral-2 rounded-3xl sm:p-6 px-2 pt-6 pb-2">
              <span className="text-primary-main italic text-32px-bold flex w-full justify-center">
                King of The Sky
              </span>
              <ProjectCard className="p-0" data={kingOfTheSky} />
            </div>
          </div>
        </div>
        {tradeHistory?.length && !isPending && (
          <div className="mt-7 mb-5 border overflow-hidden border-neutral-4 flex bg-neutral-3 rounded-lg py-1">
            <div className="loop-slide">
              {tradeHistory?.map(
                (item: ITradeHistoryResponse, index: number) => (
                  <div
                    key={index}
                    className="slide-item flex flex-row items-center text-14px-normal text-neutral-9 border-r border-neutral-4 px-3"
                  >
                    <AppTooltip title={item?.user_address}>
                      <span
                        className="mr-2 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            PATH_ROUTER.USER_PROFILE(item?.user_address)
                          );
                        }}
                      >
                        {shortenAddress(item?.user_address)}
                      </span>
                    </AppTooltip>
                    <span
                      className={
                        item?.action === "BUY"
                          ? "text-success-main"
                          : "text-error-main"
                      }
                    >
                      {item?.action}
                    </span>
                    <span className="mx-1 ml-2">
                      {formatAmount(
                        convertNumber(item?.amount, item?.decimal)
                      ) || "-"}
                    </span>
                    <span className="text-14px-normal">of</span>
                    <AppImage
                      src={item?.token_avatar}
                      alt="logo"
                      className="min-w-[24px] h-[24px] rounded-full mx-3 [&>img]:!w-full [&>img]:!h-full [&>img]:!object-cover"
                    />
                    <span className="text-14px-bold text-primary-6">
                      <AppTruncateText text={item?.token_name} maxLength={5} />
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}
        <div className="my-5">
          <AppTabs
            items={tabs}
            activeKey={activeTab}
            onChange={handleChangeTab}
            destroyInactiveTabPane={true}
          />
        </div>
      </div>
    </div>
  );
}
