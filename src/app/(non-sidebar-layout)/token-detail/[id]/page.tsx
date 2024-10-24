"use client";
import AppButton from "@/components/app-button";
import { useTokenDetail } from "@/context/TokenDetailContext";
import { getTimeDDMMMYYYYHHMM } from "@/helpers/date-time";
import useSocket from "@/hooks/useSocket";
import { BackIcon } from "@public/assets";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PriceSection from "../_components/PriceSection";
import TabsSection from "../_components/TabsSection";
import TokenInfoSection from "../_components/TokenInfoSection";
import TradeSection from "../_components/TradeSection";
import { ESocketEvent } from "@/libs/socket/constants";

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
          alert("SELL");
        }
      });
    }
    return () => {
      removeEvent(ESocketEvent.BUY);
      removeEvent(ESocketEvent.SELL);
    };
  }, [isConnected]);

  return (
    <>
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
          {tokenDetail?.kingOfTheHillDate ? (
            <div
              className="
            mt-4
            px-[10px]
            py-3
            w-full
            text-14px-bold
            text-white-neutral
            rounded-[256px] 
            bg-neutral-3 
            flex justify-center
            shadow-[inset_0px_-2px_0px_0px_rgba(191,195,184,0.15)] 
            backdrop-blur-[59.4px]
          "
            >
              Crowned king of the hill at{" "}
              {getTimeDDMMMYYYYHHMM(tokenDetail?.kingOfTheHillDate)}
            </div>
          ) : null}

          <TokenInfoSection tokenDetail={tokenDetail} />
        </div>
      </div>
    </>
  );
};

export default TokenDetailPage;
