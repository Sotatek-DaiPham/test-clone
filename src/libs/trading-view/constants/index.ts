export const configurationData = {
  supports_search: true,
  supports_marks: true,
  intraday_multipliers: [
    "1",
    "3",
    "5",
    "15",
    "30",
    "60",
    "120",
    "240",
    "360",
    "480",
    "720",
  ],
  supported_resolutions: [
    "1",
    "3",
    "5",
    "15",
    "30",
    "60",
    "120",
    "240",
    "360",
    "480",
    "720",
    "1D",
    "3D",
    "1W",
    "1M",
  ],
};

export const ID_TRADING_VIEW = "tv_chart_container";

export const DEFAULT_TRADING_VIEW_INTERVAL = "1D";

export const disabledFeatures = [
  "symbol_search_request",
  "symbol_search_hot_key",
  "header_symbol_search",
  "border_around_the_chart",
  // "timeframes_toolbar",
  // "header_widget",
];
export const getInterval = (interval: string): number => {
  const stringIntervals: { [key: string]: number } = {
    "1H": 60,
    "1D": 24 * 60,
    D: 3 * 24 * 60, // it should be '3D', but there is a bug of TradingView, it call get bars with resolution D
    "3D": 3 * 24 * 60,
    "1W": 7 * 24 * 60,
    "1M": 30 * 24 * 60,
  };
  if (stringIntervals[interval]) {
    return stringIntervals[interval];
  } else {
    return Number(interval);
  }
};

export function getIntervalString(interval: number): string {
  const days = interval / 24 / 60;
  if (days >= 30) return "1M";
  if (days >= 7) return "1W";
  if (days >= 3) return "3D";
  if (days === 1) return "1D";
  return interval.toString();
}
