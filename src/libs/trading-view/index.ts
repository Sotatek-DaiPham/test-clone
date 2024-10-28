"use client";
import { BigNumber } from "bignumber.js";
import { API_PATH } from "@/constant/api-path";
import { getAPI } from "@/service";
import {
  LibrarySymbolInfo,
  ResolveCallback,
  TradingTerminalWidgetOptions,
  widget,
} from "@public/charting_library/charting_library.min";
import get from "lodash/get";
import {
  configurationData,
  DEFAULT_TRADING_VIEW_INTERVAL,
  disabledFeatures,
  getInterval,
  getIntervalString,
  ID_TRADING_VIEW,
} from "./constants";
import { getClientTimezone } from "./helpers";

interface IParams {
  tokenAddress: string;
  symbol: string;
}

interface IDataChart {
  resolution: string;
  tokenAddress: string;
}

async function getData({ resolution, tokenAddress }: IDataChart) {
  if (!tokenAddress) return [];
  const intervalInSeconds = getInterval(resolution) * 60 * 1000;
  const data = await getAPI(API_PATH.TRADING.TRADING_VIEW, {
    params: {
      tokenAddress,
      resolution: intervalInSeconds,
    },
  });

  const dataTradingView = get(data, "data.data", []);

  const bars: any = dataTradingView.map((bar: any) => ({
    time: bar.startTimeFrame,
    close: parseFloat(
      new BigNumber(bar.close).div(new BigNumber(10).pow(6))?.toString()
    ),
    open: parseFloat(
      new BigNumber(bar.open).div(new BigNumber(10).pow(6))?.toString()
    ),
    high: parseFloat(
      new BigNumber(bar.high).div(new BigNumber(10).pow(6))?.toString()
    ),
    low: parseFloat(
      new BigNumber(bar.low).div(new BigNumber(10).pow(6))?.toString()
    ),
    volume: parseFloat(
      new BigNumber(bar.volume).div(new BigNumber(10).pow(18))?.toString()
    ),
  }));

  return bars;
}

export default async function onInitTradingView({
  tokenAddress,
  symbol,
}: IParams) {
  const widgetOptions: TradingTerminalWidgetOptions = {
    fullscreen: true,
    widgetbar: {
      details: false,
    },
    custom_css_url: "/tradingview-chart.css",
    // toolbar_bg: "#16171c",
    symbol,
    timezone: getClientTimezone(),
    enabled_features: ["study_templates"],
    interval: DEFAULT_TRADING_VIEW_INTERVAL,
    container_id: ID_TRADING_VIEW,
    library_path: "/charting_library/",
    charts_storage_url: "https://saveload.tradingview.com",
    charts_storage_api_version: "1.1",
    client_id: "tradingview.com",
    user_id: "public_user_id",
    locale: "en",
    autosize: true,
    disabled_features: disabledFeatures,
    theme: "Dark",
    toolbar_bg: "#171717",
    overrides: {
      "paneProperties.background": "#171717",
      // headerWidgetBackgroundColor:
      //   theme === THEME_MODE.LIGHT ? "#F7F7F7" : "#16171c",
      // "scalesProperties.lineColor":
      //   theme === THEME_MODE.LIGHT ? "#DDE1E8" : "#16171c",
      // "scalesProperties.textColor":
      //   theme === THEME_MODE.LIGHT ? "#9BA0AE" : "#9BA0AE",
    },
    datafeed: {
      onReady: (callback: any) => {
        setTimeout(() => callback(configurationData));
      },
      searchSymbols: (
        userInput: string,
        exchange: string,
        symbolType: string,
        onResult: any
      ) => {},
      resolveSymbol: (
        symbolName: string,
        onSymbolResolvedCallback: ResolveCallback
      ) => {
        const symbolInfo: LibrarySymbolInfo = {
          exchange: "",
          full_name: "",
          listed_exchange: "",
          ticker: symbolName,
          name: symbolName,
          description: "",
          type: "bitcoin",
          session: "24x7",
          timezone: getClientTimezone(),
          minmov: 1,
          pricescale: 100000000,
          has_intraday: true,
          has_weekly_and_monthly: true,
          intraday_multipliers: configurationData.intraday_multipliers,
          supported_resolutions: configurationData.supported_resolutions,
          // volume_precision: volumePrecision,
        };
        onSymbolResolvedCallback(symbolInfo);
      },
      getBars: async (
        symbolInfo: any,
        resolution: any,
        rangeStartDate: number,
        rangeEndDate: number,
        onResult: any,
        onError: any,
        isFirstCall: boolean
      ) => {
        console.log("resolution", resolution);
        if (isFirstCall && tokenAddress) {
          const data = await getData({
            resolution,
            tokenAddress,
          });
          onResult(data, { noData: false });
        } else {
          onResult([], { noData: true });
        }
      },
      subscribeBars: async (
        symbolInfo: any,
        resolution: any,
        onTick: any,
        listenerGuid: string,
        onResetCacheNeededCallback: () => void
      ) => {
        const interval = setInterval(async () => {
          const [data] = await getData({
            resolution,
            tokenAddress,
          });
          onTick(data);
          onResetCacheNeededCallback();
        }, 1 * 60 * 1000);
        (window as any)[listenerGuid] = interval;
      },
      unsubscribeBars: (listenerGuid: string) => {
        clearInterval((window as any)[listenerGuid]);
      },
    },
    studies_overrides: {
      "volume.show ma": true,
    },
  };
  const tvWidget = new widget(widgetOptions);
  tvWidget.onChartReady(() => {
    tvWidget.applyOverrides({
      "paneProperties.backgroundGradientStartColor": "#020024",
    });
    tvWidget.addCustomCSSFile("./index.css");

    // Hide the loading spinner once the chart is loaded
    if (!!document.getElementById("loading-spinner")) {
      document.getElementById("loading-spinner")!.style.display = "none";
      document.getElementById(ID_TRADING_VIEW)!.style.display = "block";
    }
  });
}
