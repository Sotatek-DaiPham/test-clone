"use client";
import AppButton from "@/components/app-button";
import AppRoundedInfo from "@/components/app-rounded-info";
import { useTokenDetail } from "@/context/TokenDetailContext";
import { getTimeDDMMMYYYYHHMM } from "@/helpers/date-time";
import useSocket from "@/hooks/useSocket";
import { ESocketEvent } from "@/libs/socket/constants";
import { BackIcon } from "@public/assets";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PriceSection from "../_components/PriceSection";
import TabsSection from "../_components/TabsSection";
import TokenInfoSection from "../_components/TokenInfoSection";
import TradeSection from "../_components/TradeSection";

const TradingView = dynamic(() => import("@/components/app-trading-view"), {
  ssr: false,
});

const TokenDetailPage = () => {
  const { addEvent, isConnected, removeEvent } = useSocket();
  const router = useRouter();
  const { tokenDetail } = useTokenDetail();
  useEffect(() => {
    if (isConnected) {
      addEvent(ESocketEvent.BUY, (data) => {
        if (data) {
          console.log("data", data);
        }
      });
      addEvent(ESocketEvent.SELL, (data) => {
        if (data) {
          console.log("data", data);
        }
      });
      addEvent(ESocketEvent.CREATE_TOKEN, (data) => {
        if (data) {
          console.log("data", data);
        }
      });
    }
    return () => {
      removeEvent(ESocketEvent.BUY);
      removeEvent(ESocketEvent.SELL);
      removeEvent(ESocketEvent.CREATE_TOKEN);
    };
  }, [isConnected]);

  return (
    <div className="m-auto p-2 max-w-[var(--width-content-sidebar-layout)]">
      <div
        className="flex gap-[9px] items-center mb-[26px] cursor-pointer"
        onClick={() => router.back()}
      >
        <Image src={BackIcon} alt="back icon" />
        <span className="text-white-neutral text-18px-bold">Coin Detail</span>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[65%] order-1 lg:order-1 gap-4">
          {/* Trading view section */}
          <div>
            <TradingView />
          </div>

          {tokenDetail?.timeToListDex ? (
            <div className="flex gap-6 mt-6 items-center">
              <div className="text-neutral-9 text-16px-normal">
                This token is successfully listed on Uniswap at{" "}
                {getTimeDDMMMYYYYHHMM(tokenDetail?.timeToListDex)}
              </div>
              <AppButton size="small" customClass="!w-fit">
                View On Uniswap
              </AppButton>
            </div>
          ) : null}

          {/* Tab list section */}
          <TabsSection />
        </div>

        <div className="w-full lg:w-[35%] order-2 lg:order-2 gap-4">
          {/* Buy/Sell section */}
          <div className="mb-4">
            <TradeSection />
          </div>

          {/* Detail information section */}
          <PriceSection />
          {tokenDetail?.kingOfTheHillDate && (
            <AppRoundedInfo
              customClassName="mt-4"
              text={`Crowned king of the hill at ${getTimeDDMMMYYYYHHMM(
                tokenDetail.kingOfTheHillDate
              )}`}
            />
          )}

          <TokenInfoSection tokenDetail={tokenDetail} />
        </div>
      </div>
    </div>
  );
};

export default TokenDetailPage;
