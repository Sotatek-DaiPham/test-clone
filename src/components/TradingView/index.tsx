"use client";
import { ID_TRADING_VIEW } from "@/libs/trading-view/constants";
import { useEffect, useRef } from "react";

import withClient from "@/helpers/with-client";
import onInitTradingView from "@/libs/trading-view";
import { Spin } from "antd";
import { ResolutionString } from "@public/charting_library/charting_library.min";

const TradingViewChart = () => {
  const tradingChartRef = useRef<HTMLDivElement>(null);
  const expandTradeManagementPanel = true;
  //  useAppSelector(
  //   getExpandTradeManagementPanel
  // );
  useEffect(() => {
    onInitTradingView({
      marketId: "1",
      symbol: "ETH",
    });
  }, []);
  return (
    <div
      className="border-border-primary border-solid border-r-[3px] w-full h-full flex flex-col"
      ref={tradingChartRef}
    >
      <div
        className={`flex items-center justify-center w-full flex-1 max-xl:mb-4 2xs:max-xl:!h-[491px] ${
          expandTradeManagementPanel
            ? "xl:!h-[calc(100vh-2px-var(--height-header)-var(--height-footer)-var(--height-trading-overview)-var(--height-trading-options)-var(--height-trading-management-panel))]"
            : "xl:!h-[calc(100vh-2px-var(--height-header)-var(--height-footer)-var(--height-trading-overview)-var(--height-trading-options)-var(--height-trading-management-panel)-var(--height-trading-management-panel-expand))]"
        }`}
      >
        <div className="h-full flex items-center justify-center flex-1">
          <div
            id="loading-spinner"
            className="h-full flex justify-center items-center"
            style={{ display: "none" }}
          >
            <Spin size="large" />
          </div>
          <div
            className={`w-full h-full [&>iframe]:!rounded-none 2xs:max-xl:[&>iframe]:!h-[491px]
        ${
          !expandTradeManagementPanel
            ? "xl:[&>iframe]:!h-[calc(100vh-2px-var(--height-header)-var(--height-footer)-var(--height-trading-overview)-var(--height-trading-options)-var(--height-trading-management-panel))]"
            : "xl:[&>iframe]:!h-[calc(100vh-2px-var(--height-header)-var(--height-footer)-var(--height-trading-overview)-var(--height-trading-options)-var(--height-trading-management-panel)-var(--height-trading-management-panel-expand))]"
        } `}
            id={ID_TRADING_VIEW}
          />
        </div>
      </div>
    </div>
  );
};

export default withClient(TradingViewChart);
