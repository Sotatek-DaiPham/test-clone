"use client";
import { ID_TRADING_VIEW } from "@/libs/trading-view/constants";
import { useEffect, useRef } from "react";

import { useTokenDetail } from "@/context/TokenDetailContext";
import withClient from "@/helpers/with-client";
import onInitTradingView from "@/libs/trading-view";
import { Spin } from "antd";

// interface IParams {
//   tokenAddress: string;
//   symbol: string;
//   createdAt: string | null;
// }

// interface IDataChart {
//   resolution: string;
//   tokenAddress: string;
//   endTime?: number;
// }

// async function getData({ resolution, tokenAddress, endTime }: IDataChart) {
//   if (!tokenAddress) return [];
//   const intervalInSeconds = getInterval(resolution) * 60 * 1000;
//   const data = await getAPI(API_PATH.TRADING.TRADING_VIEW, {
//     params: {
//       tokenAddress,
//       resolution: intervalInSeconds,
//       endDateMilis: endTime,
//     },
//   });

//   const dataTradingView = get(data, "data.data", []);

//   const bars: any = dataTradingView.map((bar: any) => ({
//     time: bar.startTimeFrame,
//     close: parseFloat(
//       new BigNumber(bar.close).div(new BigNumber(10).pow(6))?.toString()
//     ),
//     open: parseFloat(
//       new BigNumber(bar.open).div(new BigNumber(10).pow(6))?.toString()
//     ),
//     high: parseFloat(
//       new BigNumber(bar.high).div(new BigNumber(10).pow(6))?.toString()
//     ),
//     low: parseFloat(
//       new BigNumber(bar.low).div(new BigNumber(10).pow(6))?.toString()
//     ),
//     volume: parseFloat(
//       new BigNumber(bar.volume).div(new BigNumber(10).pow(18))?.toString()
//     ),
//   }));

//   return bars;
// }

const TradingViewChart = () => {
  // const [widgetCom, setWidgetCom] = useState<IChartingLibraryWidget | null>();
  const { tokenDetail } = useTokenDetail();
  const tradingChartRef = useRef<HTMLDivElement>(null);
  // const [isChartReady, setChartReady] = useState(false);
  // const chartResetCacheNeededCallback = useRef<() => void>();
  // const [timeFrame, setTimeFrame] = useState<number>(0);
  // const { isConnected, socket } = useSocket();
  // const pathname = usePathname;
  useEffect(() => {
    if (tradingChartRef.current) {
      onInitTradingView({
        tokenAddress: tokenDetail?.contractAddress,
        symbol: tokenDetail?.symbol,
        createdAt: tokenDetail?.createdAt,
      });
    }
  }, [tokenDetail]);

  // const onReady = (callback: any) => {
  //   setTimeout(() => callback(configurationData));
  // };

  // const resolveSymbol = (
  //   symbolName: string,
  //   onSymbolResolvedCallback: ResolveCallback
  // ) => {
  //   const symbolInfo: LibrarySymbolInfo = {
  //     exchange: "",
  //     full_name: "",
  //     listed_exchange: "",
  //     ticker: symbolName,
  //     name: symbolName,
  //     description: "",
  //     type: "bitcoin",
  //     session: "24x7",
  //     timezone: getClientTimezone(),
  //     minmov: 1,
  //     pricescale: 100000000,
  //     has_intraday: true,
  //     has_weekly_and_monthly: true,
  //     intraday_multipliers: configurationData.intraday_multipliers,
  //     supported_resolutions: configurationData.supported_resolutions,
  //     // volume_precision: volumePrecision,
  //   };
  //   onSymbolResolvedCallback(symbolInfo);
  // };

  // const getBars = async (
  //   symbolInfo: any,
  //   resolution: any,
  //   from: number,
  //   to: number,
  //   onResult: HistoryCallback,
  //   onError: any,
  //   isFirstCall: boolean
  // ) => {
  //   if (
  //     tokenDetail?.createdAt &&
  //     !isFirstCall &&
  //     from < dayjs(tokenDetail?.createdAt).unix()
  //   ) {
  //     return onResult([], { noData: true });
  //   }
  //   if (tokenDetail?.contractAddress) {
  //     const startTime = from * 1000;
  //     const endTime = to * 1000;
  //     const time = isFirstCall ? endTime : startTime;
  //     setTimeFrame(time);
  //     const data = await getData({
  //       resolution,
  //       tokenAddress: tokenDetail?.contractAddress,
  //       endTime: time,
  //     });
  //     onResult(data, { noData: false });
  //   } else {
  //     onResult([], { noData: true });
  //   }
  // };

  // const subscribeBars = async (
  //   symbolInfo: any,
  //   resolution: any,
  //   onTick: any,
  //   listenerGuid: string,
  //   onResetCacheNeededCallback: () => void
  // ) => {
  //   if (isConnected) {
  //     socket?.on(ESocketEvent.BUY, async (res: ISocketData) => {
  //       if (res.data.tokenAddress === tokenDetail?.contractAddress) {
  //         console.log("buy event");
  //       }
  //       const [data] = await getData({
  //         resolution,
  //         tokenAddress: tokenDetail?.contractAddress,
  //         endTime: timeFrame,
  //       });
  //       onTick(data);
  //       onResetCacheNeededCallback();
  //     });
  //     socket?.on(ESocketEvent.SELL, async (res: ISocketData) => {
  //       const [data] = await getData({
  //         resolution,
  //         tokenAddress: tokenDetail?.contractAddress,
  //         endTime: timeFrame,
  //       });
  //       onTick(data);
  //       onResetCacheNeededCallback();
  //     });
  //   }
  // };

  // const datafeed: IBasicDataFeed = {
  //   onReady,
  //   searchSymbols: () => {},
  //   resolveSymbol,
  //   getBars,
  //   subscribeBars,
  //   unsubscribeBars: () => {},
  // };

  // useEffect(() => {
  //   if (!tradingChartRef.current) {
  //     return;
  //   }
  //   const widgetOptions: TradingTerminalWidgetOptions = {
  //     fullscreen: true,
  //     widgetbar: {
  //       details: false,
  //     },
  //     custom_css_url: "/tradingview-chart.css",
  //     symbol: tokenDetail?.symbol,
  //     timezone: getClientTimezone(),
  //     enabled_features: ["study_templates"],
  //     interval: DEFAULT_TRADING_VIEW_INTERVAL,
  //     container_id: ID_TRADING_VIEW,
  //     library_path: "/charting_library/",
  //     charts_storage_url: "https://saveload.tradingview.com",
  //     charts_storage_api_version: "1.1",
  //     client_id: "tradingview.com",
  //     user_id: "public_user_id",
  //     locale: "en",
  //     autosize: true,
  //     disabled_features: disabledFeatures,
  //     theme: "Dark",
  //     toolbar_bg: "#171717",
  //     overrides: {
  //       "paneProperties.background": "#171717",
  //     },
  //     studies_overrides: {
  //       "volume.show ma": true,
  //     },
  //     datafeed: datafeed,
  //   };

  //   const tvWidget = new widget(widgetOptions);
  //   setWidgetCom(tvWidget);
  //   tvWidget.onChartReady(() => {
  //     setChartReady(true);
  //     tvWidget?.chart().setResolution("1D", () => {});
  //     tvWidget.applyOverrides({
  //       "paneProperties.backgroundGradientStartColor": "#020024",
  //     });
  //     tvWidget.addCustomCSSFile("./index.css");
  //     tvWidget.applyOverrides({ "paneProperties.topMargin": 15 });
  //     if (!!document.getElementById("loading-spinner")) {
  //       document.getElementById("loading-spinner")!.style.display = "none";
  //       document.getElementById(ID_TRADING_VIEW)!.style.display = "block";
  //     }
  //   });
  // }, [tokenDetail]);

  // useEffect(() => {
  //   if (isChartReady && tokenDetail) {
  //     const symbol = tokenDetail.symbol;
  //     widgetCom?.chart().setSymbol(symbol, () => {});
  //   }
  // }, [isChartReady, tokenDetail]);

  // useEffect(() => {
  //   if (isChartReady) {
  //     const onResetCacheNeededCallback = chartResetCacheNeededCallback.current;
  //     if (onResetCacheNeededCallback) onResetCacheNeededCallback();
  //     widgetCom?.chart().resetData();
  //   }
  // }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div className={`flex items-center justify-center w-full flex-1 `}>
        <div className="h-full flex items-center justify-center flex-1">
          <div
            id="loading-spinner"
            className="h-full flex justify-center items-center"
            style={{ display: "none" }}
          >
            <Spin size="large" />
          </div>
          <div
            ref={tradingChartRef}
            className={`w-full h-full [&>iframe]:!h-[var(--height-trading-view)]`}
            id={ID_TRADING_VIEW}
          />
        </div>
      </div>
    </div>
  );
};

export default withClient(TradingViewChart);
