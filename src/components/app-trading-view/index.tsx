"use client";
import { ID_TRADING_VIEW } from "@/libs/trading-view/constants";
import { useEffect, useRef } from "react";

import withClient from "@/helpers/with-client";
import onInitTradingView from "@/libs/trading-view";
import { Spin } from "antd";

const TradingViewChart = () => {
  const tradingChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onInitTradingView({
      marketId: "1",
      symbol: "ETH",
    });
  }, []);
  return (
    <div className="w-full h-full flex flex-col" ref={tradingChartRef}>
      <div className={`flex items-center justify-center w-full flex-1 `}>
        <div className="h-full flex items-center justify-center flex-1">
          <div
            id="loading-spinner"
            className="h-full flex justify-center items-center"
            style={{ display: "none" }}
          >
            <Spin size="large" />
          </div>
          <div className={`w-full h-full`} id={ID_TRADING_VIEW} />
        </div>
      </div>
    </div>
  );
};

export default withClient(TradingViewChart);
