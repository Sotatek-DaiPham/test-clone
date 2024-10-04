import get from "lodash/get";
import { configurationData, ID_TRADING_VIEW } from "./constants";
import { getClientTimezone } from "./helpers";
import {
  LibrarySymbolInfo,
  ResolveCallback,
  TradingTerminalWidgetOptions,
  widget,
} from "@public/charting_library/charting_library.min";

interface IParams {
  marketId: string;
  symbol: string;
}

interface IDataChart {
  resolution: string;
  countback: number;
  marketId: string;
}

async function getData({ resolution, countback, marketId }: IDataChart) {
  if (!marketId) return [];
  // const data = await fetchMarketsHistory([marketId], resolution, countback);
  const data: any = [];
  return get(data, "[0].c")?.map((_: any, index: number) => {
    return {
      time: get(data, `[0].t.${index}`, 0) * 1000,
      close: get(data, `[0].c.${index}`),
      open: get(data, `[0].o.${index}`, 0),
      high: get(data, `[0].h.${index}`, 0),
      low: get(data, `[0].l.${index}`, 0),
      volume: get(data, `[0].v.${index}`, 0),
    };
  });
}

export default async function onInitTradingView({ marketId, symbol }: IParams) {
  const widgetOptions: TradingTerminalWidgetOptions = {
    fullscreen: true,
    widgetbar: {
      details: false,
    },
    custom_css_url: "/tradingview-chart.css",
    toolbar_bg: "#16171c",
    symbol,
    timezone: getClientTimezone(),
    interval: "60",
    container_id: ID_TRADING_VIEW,
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
          timezone: "America/Mexico_City",
          minmov: 1,
          pricescale: 10,
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
        if (isFirstCall && marketId) {
          const data = await getData({
            resolution,
            countback: 960,
            marketId,
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
          const [data] = await getData({ resolution, countback: 1, marketId });
          onTick(data);
          onResetCacheNeededCallback();
        }, 1 * 60 * 1000);
        (window as any)[listenerGuid] = interval;
      },
      unsubscribeBars: (listenerGuid: string) => {
        clearInterval((window as any)[listenerGuid]);
      },
    },
    library_path: "/charting_library/",
    locale: "en",
    user_id: "public_user_id",
    disabled_features: [
      "symbol_search_request",
      "symbol_search_hot_key",
      "header_symbol_search",
      // "timeframes_toolbar",
      // "header_widget",
      "border_around_the_chart",
    ],
    theme: "Dark",
    // overrides: {
    //   "paneProperties.background":
    //     theme === THEME_MODE.LIGHT ? "#FFFFFF" : "#16171c",
    //   headerWidgetBackgroundColor:
    //     theme === THEME_MODE.LIGHT ? "#F7F7F7" : "#16171c",
    //   "scalesProperties.lineColor":
    //     theme === THEME_MODE.LIGHT ? "#DDE1E8" : "#16171c",
    //   "scalesProperties.textColor":
    //     theme === THEME_MODE.LIGHT ? "#9BA0AE" : "#9BA0AE",
    // },
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
